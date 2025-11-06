"use client";
import React, { useState, useEffect } from "react";
import styles from "./ClientRequests.module.css";
import {
  FiMail,
  FiEye,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiSend,
  FiX,
  FiUser,
  FiMessageSquare,
  FiFileText,
  FiCornerDownLeft,
  FiRefreshCw,
  FiPaperclip,
} from "react-icons/fi";
import FlexibleSelect from "@/components/UI/FlexibleSelect/FlexibleSelect";

const ClientRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Service Functions
  const clientRequestsAPI = {
    // GET all client requests with filters
    getAllRequests: async (statusFilter = "all", typeFilter = "all") => {
      try {
        const queryParams = new URLSearchParams();
        if (statusFilter !== "all") queryParams.append("status", statusFilter);
        if (typeFilter !== "all") queryParams.append("type", typeFilter);

        const response = await fetch(`/api/client-requests?${queryParams}`);
        if (!response.ok) throw new Error("Failed to fetch client requests");
        return await response.json();
      } catch (error) {
        throw new Error(`Error fetching client requests: ${error.message}`);
      }
    },

    // UPDATE client request (add reply or change status)
    updateRequest: async (requestId, updateData) => {
      try {
        const response = await fetch("/api/client-requests", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: requestId,
            ...updateData,
          }),
        });
        if (!response.ok) throw new Error("Failed to update client request");
        return await response.json();
      } catch (error) {
        throw new Error(`Error updating client request: ${error.message}`);
      }
    },

    // DELETE client request
    deleteRequest: async (requestId) => {
      try {
        const response = await fetch("/api/client-requests", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: requestId }),
        });
        if (!response.ok) throw new Error("Failed to delete client request");
        return await response.json();
      } catch (error) {
        throw new Error(`Error deleting client request: ${error.message}`);
      }
    },

    // SEND REPLY with nodemailer
    sendReply: async (requestId, replyData) => {
      try {
        const response = await fetch("/api/client-requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "send-reply",
            requestId,
            ...replyData,
          }),
        });
        if (!response.ok) throw new Error("Failed to send reply");
        return await response.json();
      } catch (error) {
        throw new Error(`Error sending reply: ${error.message}`);
      }
    },
  };

  // Load requests on component mount and when filters change
  useEffect(() => {
    loadRequests();
  }, [filter, typeFilter]);

  // Load all requests from API
  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const requestsData = await clientRequestsAPI.getAllRequests(
        filter,
        typeFilter
      );
      setRequests(requestsData);
    } catch (err) {
      setError(err.message);
      console.error("Error loading client requests:", err);
    } finally {
      setLoading(false);
    }
  };

  // View request details
  const handleViewRequest = (request) => {
    setViewingRequest(request);
  };

  // Start replying to a request
  const handleStartReply = (request) => {
    setReplyingTo(request);
    setReplyMessage("");
  };

  // Send reply with nodemailer
  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      alert("Please enter a reply message.");
      return;
    }

    // Check if we have an email to send to
    if (!replyingTo.email) {
      alert("Cannot send email: No email address found for this submission.");
      return;
    }

    setLoading(true);
    try {
      const newReply = {
        id: `reply-${Date.now()}`,
        message: replyMessage,
        sentAt: new Date().toISOString(),
        sentBy: "Admin",
      };

      // First, send the email via nodemailer
      const emailResult = await clientRequestsAPI.sendReply(replyingTo.id, {
        replyMessage: replyMessage,
        clientName: replyingTo.name,
        originalSubject: replyingTo.subject,
        formTitle: replyingTo.formTitle,
        type: replyingTo.type,
      });

      if (!emailResult.success) {
        throw new Error(emailResult.error || "Failed to send email");
      }

      // Then update the request in database with the new reply
      const updatedRequest = await clientRequestsAPI.updateRequest(
        replyingTo.id,
        {
          status: "replied",
          replies: [...(replyingTo.replies || []), newReply],
        }
      );

      // Update local state
      setRequests((prev) =>
        prev.map((request) =>
          request.id === replyingTo.id ? updatedRequest : request
        )
      );

      // Update viewing request if it's the same
      if (viewingRequest && viewingRequest.id === replyingTo.id) {
        setViewingRequest(updatedRequest);
      }

      setReplyingTo(null);
      setReplyMessage("");
      alert("Reply sent successfully via email!");
    } catch (err) {
      setError(err.message);
      alert("Failed to send reply: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mark request as closed
  const handleMarkAsClosed = async (requestId) => {
    setLoading(true);
    try {
      const updatedRequest = await clientRequestsAPI.updateRequest(requestId, {
        status: "closed",
      });

      setRequests((prev) =>
        prev.map((request) =>
          request.id === requestId ? updatedRequest : request
        )
      );

      // Update viewing request if it's the same
      if (viewingRequest && viewingRequest.id === requestId) {
        setViewingRequest(updatedRequest);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete request
  const handleDeleteRequest = async (requestId) => {
    if (!confirm("Are you sure you want to delete this request?")) {
      return;
    }

    setLoading(true);
    try {
      await clientRequestsAPI.deleteRequest(requestId);
      setRequests((prev) => prev.filter((request) => request.id !== requestId));

      // Close modals if viewing the deleted request
      if (viewingRequest && viewingRequest.id === requestId) {
        setViewingRequest(null);
      }
      if (replyingTo && replyingTo.id === requestId) {
        setReplyingTo(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case "new":
        return { icon: <FiClock />, color: "#FF6B6B", label: "New" };
      case "replied":
        return {
          icon: <FiCornerDownLeft />,
          color: "#4ECDC4",
          label: "Replied",
        };
      case "closed":
        return { icon: <FiCheckCircle />, color: "#96CEB4", label: "Closed" };
      default:
        return { icon: <FiClock />, color: "#FF6B6B", label: "New" };
    }
  };

  // Get type icon and label
  const getTypeInfo = (type) => {
    switch (type) {
      case "contact_form":
        return { icon: <FiMessageSquare />, label: "Contact Form" };
      case "form_submission":
        return { icon: <FiFileText />, label: "Form Submission" };
      default:
        return { icon: <FiMail />, label: "General" };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper function to get file icon
  const getFileIcon = (fileName) => {
    const extension = fileName?.split(".").pop()?.toLowerCase();
    const icons = {
      pdf: "📄",
      doc: "📝",
      docx: "📝",
      jpg: "🖼️",
      jpeg: "🖼️",
      png: "🖼️",
      default: "📎",
    };
    return icons[extension] || icons.default;
  };

  if (loading && requests.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <FiRefreshCw className={styles.spinner} />
          <p>Loading client requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Client Requests</h1>
          <div className={styles.stats}>
            <div className={styles.stat}>
              Total: <strong>{requests.length}</strong>
            </div>
            <div className={styles.stat}>
              New:{" "}
              <strong>
                {requests.filter((r) => r.status === "new").length}
              </strong>
            </div>
            <div className={styles.stat}>
              Replied:{" "}
              <strong>
                {requests.filter((r) => r.status === "replied").length}
              </strong>
            </div>
          </div>
          <button
            className={styles.refreshButton}
            onClick={loadRequests}
            disabled={loading}
          >
            <FiRefreshCw className={loading ? styles.spinner : ""} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className={styles.filters}>
          <FlexibleSelect
            options={[
              { value: "all", label: "All Status" },
              { value: "new", label: "New" },
              { value: "replied", label: "Replied" },
              { value: "closed", label: "Closed" },
            ]}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            name="statusFilter"
            variant="inline"
            width="150px"
            size="small"
          />

          <FlexibleSelect
            options={[
              { value: "all", label: "All Types" },
              { value: "contact_form", label: "Contact Form" },
              { value: "form_submission", label: "Form Submissions" },
            ]}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            name="typeFilter"
            variant="inline"
            width="180px"
            size="small"
          />
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Requests List */}
      <div className={styles.requestsList}>
        {requests.length === 0 ? (
          <div className={styles.emptyState}>
            <FiMail className={styles.emptyIcon} />
            <h3>No requests found</h3>
            <p>There are no client requests matching your current filters.</p>
          </div>
        ) : (
          requests.map((request) => {
            const statusInfo = getStatusInfo(request.status);
            const typeInfo = getTypeInfo(request.type);

            return (
              <div key={request.id} className={styles.requestCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.requestInfo}>
                    <div className={styles.requestType}>
                      <span className={styles.typeIcon}>{typeInfo.icon}</span>
                      <span className={styles.typeLabel}>{typeInfo.label}</span>
                    </div>
                    <div
                      className={styles.statusBadge}
                      style={{ backgroundColor: statusInfo.color }}
                    >
                      {statusInfo.icon}
                      {statusInfo.label}
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      className={styles.viewBtn}
                      onClick={() => handleViewRequest(request)}
                      title="View Details"
                      disabled={loading}
                    >
                      <FiEye />
                    </button>
                    <button
                      className={styles.replyBtn}
                      onClick={() => handleStartReply(request)}
                      title={
                        !request.email
                          ? "No email address to reply to"
                          : "Reply"
                      }
                      disabled={
                        request.status === "closed" || loading || !request.email
                      }
                    >
                      <FiCornerDownLeft />
                    </button>
                    <button
                      className={styles.closeBtn}
                      onClick={() => handleMarkAsClosed(request.id)}
                      title="Mark as Closed"
                      disabled={request.status === "closed" || loading}
                    >
                      <FiCheckCircle />
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteRequest(request.id)}
                      title="Delete Request"
                      disabled={loading}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.clientInfo}>
                    <div className={styles.avatar}>
                      <FiUser />
                    </div>
                    <div className={styles.clientDetails}>
                      <h4 className={styles.clientName}>{request.name}</h4>
                      <p className={styles.clientEmail}>{request.email}</p>
                    </div>
                  </div>

                  <div className={styles.requestPreview}>
                    <h5 className={styles.subject}>{request.subject}</h5>
                    {request.message ? (
                      <p className={styles.messagePreview}>
                        {request.message.length > 150
                          ? `${request.message.substring(0, 150)}...`
                          : request.message}
                      </p>
                    ) : (
                      <p className={styles.formSubmission}>
                        Form: {request.formTitle}
                      </p>
                    )}

                    {/* Show attachment count if any */}
                    {request.attachments && request.attachments.length > 0 && (
                      <div className={styles.attachmentsPreview}>
                        <FiPaperclip />
                        <span>{request.attachments.length} attachment(s)</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.requestMeta}>
                    <span className={styles.date}>
                      {formatDate(request.submittedAt)}
                    </span>
                    {request.replies && request.replies.length > 0 && (
                      <span className={styles.repliesCount}>
                        {request.replies.length} repl
                        {request.replies.length === 1 ? "y" : "ies"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className={styles.loadingOverlay}>
          <FiRefreshCw className={styles.spinner} />
          <p>Processing...</p>
        </div>
      )}

      {/* Request Detail Modal */}
      {viewingRequest && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Request Details</h2>
              <button
                onClick={() => setViewingRequest(null)}
                className={styles.closeModalBtn}
                disabled={loading}
              >
                <FiX />
              </button>
            </div>

            <div className={styles.requestDetail}>
              <div className={styles.detailHeader}>
                <div className={styles.clientInfo}>
                  <div className={styles.avatar}>
                    <FiUser />
                  </div>
                  <div>
                    <h3>{viewingRequest.name}</h3>
                    <p>{viewingRequest.email}</p>
                    {viewingRequest.phone && <p>{viewingRequest.phone}</p>}
                    {viewingRequest.company && <p>{viewingRequest.company}</p>}
                  </div>
                </div>

                <div className={styles.detailMeta}>
                  <div className={styles.metaItem}>
                    <strong>Type:</strong>{" "}
                    {getTypeInfo(viewingRequest.type).label}
                  </div>
                  <div className={styles.metaItem}>
                    <strong>Submitted:</strong>{" "}
                    {formatDate(viewingRequest.submittedAt)}
                  </div>
                  <div className={styles.metaItem}>
                    <strong>Status:</strong>
                    <span
                      className={styles.statusText}
                      style={{
                        color: getStatusInfo(viewingRequest.status).color,
                      }}
                    >
                      {getStatusInfo(viewingRequest.status).label}
                    </span>
                  </div>
                  {viewingRequest.projectType && (
                    <div className={styles.metaItem}>
                      <strong>Project Type:</strong>{" "}
                      {viewingRequest.projectType}
                    </div>
                  )}
                  {viewingRequest.budget && (
                    <div className={styles.metaItem}>
                      <strong>Budget:</strong> {viewingRequest.budget}
                    </div>
                  )}
                  {viewingRequest.timeline && (
                    <div className={styles.metaItem}>
                      <strong>Timeline:</strong> {viewingRequest.timeline}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.detailContent}>
                <h4>
                  {viewingRequest.type === "contact_form"
                    ? `Subject: ${viewingRequest.subject}`
                    : `Form: ${viewingRequest.formTitle}`}
                </h4>

                {viewingRequest.type === "contact_form" ? (
                  <div className={styles.messageContent}>
                    <p>{viewingRequest.message}</p>
                    {/* Show contact form specific fields */}
                    {viewingRequest.projectType && (
                      <div className={styles.formField}>
                        <label>Project Type:</label>
                        <span>{viewingRequest.projectType}</span>
                      </div>
                    )}
                    {viewingRequest.budget && (
                      <div className={styles.formField}>
                        <label>Budget:</label>
                        <span>{viewingRequest.budget}</span>
                      </div>
                    )}
                    {viewingRequest.timeline && (
                      <div className={styles.formField}>
                        <label>Timeline:</label>
                        <span>{viewingRequest.timeline}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.formData}>
                    <h5>Form Submission Data</h5>
                    <div className={styles.formFields}>
                      {viewingRequest.submissionData &&
                        Object.entries(viewingRequest.submissionData).map(
                          ([fieldId, value], index) => (
                            <div key={index} className={styles.formField}>
                              <label>{fieldId}:</label>
                              <span>{String(value)}</span>
                            </div>
                          )
                        )}
                    </div>
                  </div>
                )}

                {/* Show Attachments */}
                {viewingRequest.attachments && viewingRequest.attachments.length > 0 && (
                  <div className={styles.attachmentsSection}>
                    <h5>Attachments</h5>
                    <div className={styles.attachmentsList}>
                      {viewingRequest.attachments.map((attachment, index) => (
                        <div key={index} className={styles.attachmentItem}>
                          <span className={styles.fileIcon}>
                            {getFileIcon(attachment.filename || attachment.originalName)}
                          </span>
                          <div className={styles.fileInfo}>
                            <span className={styles.fileName}>
                              {attachment.filename || attachment.originalName}
                            </span>
                            {attachment.url && (
                              <a 
                                href={attachment.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.fileLink}
                              >
                                View File
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conversation Thread - ADDED THIS SECTION */}
                <div className={styles.conversation}>
                  <h5>Conversation History</h5>
                  {(!viewingRequest.replies || viewingRequest.replies.length === 0) ? (
                    <div className={styles.noReplies}>
                      <p>No replies yet. Start the conversation by sending a reply.</p>
                    </div>
                  ) : (
                    <div className={styles.replies}>
                      {viewingRequest.replies.map((reply) => (
                        <div key={reply.id} className={styles.reply}>
                          <div className={styles.replyHeader}>
                            <strong>{reply.sentBy}</strong>
                            <span>{formatDate(reply.sentAt)}</span>
                          </div>
                          <div className={styles.replyMessage}>
                            {reply.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  onClick={() => handleStartReply(viewingRequest)}
                  className={styles.replyBtn}
                  disabled={viewingRequest.status === "closed" || loading || !viewingRequest.email}
                >
                  <FiCornerDownLeft /> Reply via Email
                </button>
                <button
                  onClick={() => handleMarkAsClosed(viewingRequest.id)}
                  className={styles.closeBtn}
                  disabled={viewingRequest.status === "closed" || loading}
                >
                  <FiCheckCircle /> Mark as Closed
                </button>
                <button
                  onClick={() => setViewingRequest(null)}
                  className={styles.cancelBtn}
                  disabled={loading}
                >
                  <FiX /> Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyingTo && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Send Email Reply</h2>
              <button
                onClick={() => setReplyingTo(null)}
                className={styles.closeModalBtn}
                disabled={loading}
              >
                <FiX />
              </button>
            </div>

            <div className={styles.replyForm}>
              <div className={styles.recipientInfo}>
                <p>
                  <strong>To:</strong> {replyingTo.name} &lt;{replyingTo.email}
                  &gt;
                </p>
                <p>
                  <strong>Subject:</strong> Re: {replyingTo.subject}
                </p>
                <p className={styles.emailNote}>
                  This reply will be sent via email and saved in the
                  conversation history.
                </p>
              </div>

              <div className={styles.formGroup}>
                <label>Your Message:</label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply message here. This will be sent as an email to the client..."
                  rows="8"
                  className={styles.replyTextarea}
                  disabled={loading}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  onClick={handleSendReply}
                  className={styles.sendBtn}
                  disabled={!replyMessage.trim() || loading}
                >
                  {loading ? (
                    <FiRefreshCw className={styles.spinner} />
                  ) : (
                    <FiSend />
                  )}
                  Send Email Reply
                </button>
                <button
                  onClick={() => setReplyingTo(null)}
                  className={styles.cancelBtn}
                  disabled={loading}
                >
                  <FiX /> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientRequests;