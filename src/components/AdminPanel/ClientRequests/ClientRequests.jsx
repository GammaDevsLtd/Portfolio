"use client";
import React, { useState } from "react";
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
} from "react-icons/fi";
import FlexibleSelect from "@/components/UI/FlexibleSelect/FlexibleSelect";

// Sample initial data
const initialRequests = [
  {
    id: "req-1",
    type: "contact_form",
    name: "John Doe",
    email: "john@example.com",
    subject: "Website Development Inquiry",
    message:
      "Hello, I am interested in your web development services. Can we schedule a call to discuss my project requirements?",
    submittedAt: new Date("2024-01-20T10:30:00").toISOString(),
    status: "new", // new, replied, closed
    formData: null,
    replies: [],
  },
  {
    id: "req-2",
    type: "form_submission",
    name: "Jane Smith",
    email: "jane@example.com",
    subject: "Customer Feedback Form Submission",
    message: null,
    submittedAt: new Date("2024-01-22T14:15:00").toISOString(),
    status: "replied",
    formData: {
      formTitle: "Customer Feedback Form",
      fields: [
        { label: "Full Name", value: "Jane Smith" },
        { label: "Email Address", value: "jane@example.com" },
        {
          label: "Feedback",
          value: "Great service! The team was very professional.",
        },
        { label: "Rating", value: "Excellent" },
      ],
    },
    replies: [
      {
        id: "reply-1",
        message:
          "Thank you for your feedback! We are glad to hear about your positive experience.",
        sentAt: new Date("2024-01-22T15:00:00").toISOString(),
        sentBy: "Admin",
      },
    ],
  },
  {
    id: "req-3",
    type: "contact_form",
    name: "Mike Johnson",
    email: "mike@techcorp.com",
    subject: "Partnership Opportunity",
    message:
      "We would like to explore potential partnership opportunities with your company. Our team specializes in enterprise solutions and we believe there is synergy between our offerings.",
    submittedAt: new Date("2024-01-23T09:45:00").toISOString(),
    status: "closed",
    formData: null,
    replies: [
      {
        id: "reply-2",
        message:
          "Thank you for reaching out. We have forwarded your inquiry to our partnership team and they will contact you shortly.",
        sentAt: new Date("2024-01-23T10:30:00").toISOString(),
        sentBy: "Admin",
      },
      {
        id: "reply-3",
        message:
          "Following up on our previous conversation. Are you available for a meeting next week?",
        sentAt: new Date("2024-01-25T11:00:00").toISOString(),
        sentBy: "Admin",
      },
    ],
  },
];

const ClientRequests = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [filter, setFilter] = useState("all"); // all, new, replied, closed
  const [typeFilter, setTypeFilter] = useState("all"); // all, contact_form, form_submission

  // Filter requests based on status and type
  const filteredRequests = requests.filter((request) => {
    const statusMatch = filter === "all" || request.status === filter;
    const typeMatch = typeFilter === "all" || request.type === typeFilter;
    return statusMatch && typeMatch;
  });

  // View request details
  const handleViewRequest = (request) => {
    setViewingRequest(request);
  };

  // Start replying to a request
  const handleStartReply = (request) => {
    setReplyingTo(request);
    setReplyMessage("");
  };

  // Send reply
  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      alert("Please enter a reply message.");
      return;
    }

    const newReply = {
      id: `reply-${Date.now()}`,
      message: replyMessage,
      sentAt: new Date().toISOString(),
      sentBy: "Admin",
    };

    setRequests((prev) =>
      prev.map((request) =>
        request.id === replyingTo.id
          ? {
              ...request,
              status: "replied",
              replies: [...request.replies, newReply],
            }
          : request
      )
    );

    // In a real app, you would send the email here
    console.log("Sending email to:", replyingTo.email);
    console.log("Subject: Re:", replyingTo.subject);
    console.log("Message:", replyMessage);

    setReplyingTo(null);
    setReplyMessage("");
    alert("Reply sent successfully!");
  };

  // Mark request as closed
  const handleMarkAsClosed = (requestId) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === requestId ? { ...request, status: "closed" } : request
      )
    );
  };

  // Delete request
  const handleDeleteRequest = (requestId) => {
    if (confirm("Are you sure you want to delete this request?")) {
      setRequests((prev) => prev.filter((request) => request.id !== requestId));
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

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Client Requests</h1>
          <div className={styles.stats}>
            <span className={styles.stat}>
              Total: <strong>{requests.length}</strong>
            </span>
            <span className={styles.stat}>
              New:{" "}
              <strong>
                {requests.filter((r) => r.status === "new").length}
              </strong>
            </span>
            <span className={styles.stat}>
              Replied:{" "}
              <strong>
                {requests.filter((r) => r.status === "replied").length}
              </strong>
            </span>
          </div>
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

      {/* Requests List */}
      <div className={styles.requestsList}>
        {filteredRequests.length === 0 ? (
          <div className={styles.emptyState}>
            <FiMail className={styles.emptyIcon} />
            <h3>No requests found</h3>
            <p>There are no client requests matching your current filters.</p>
          </div>
        ) : (
          filteredRequests.map((request) => {
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
                    >
                      <FiEye />
                    </button>
                    <button
                      className={styles.replyBtn}
                      onClick={() => handleStartReply(request)}
                      title="Reply"
                      disabled={request.status === "closed"}
                    >
                      <FiCornerDownLeft />
                    </button>
                    <button
                      className={styles.closeBtn}
                      onClick={() => handleMarkAsClosed(request.id)}
                      title="Mark as Closed"
                      disabled={request.status === "closed"}
                    >
                      <FiCheckCircle />
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteRequest(request.id)}
                      title="Delete Request"
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
                        Form: {request.formData?.formTitle}
                      </p>
                    )}
                  </div>

                  <div className={styles.requestMeta}>
                    <span className={styles.date}>
                      {formatDate(request.submittedAt)}
                    </span>
                    {request.replies.length > 0 && (
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

      {/* Request Detail Modal */}
      {viewingRequest && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Request Details</h2>
              <button
                onClick={() => setViewingRequest(null)}
                className={styles.closeModalBtn}
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
                </div>
              </div>

              <div className={styles.detailContent}>
                <h4>Subject: {viewingRequest.subject}</h4>

                {viewingRequest.message ? (
                  <div className={styles.messageContent}>
                    <p>{viewingRequest.message}</p>
                  </div>
                ) : (
                  <div className={styles.formData}>
                    <h5>
                      Form Submission: {viewingRequest.formData?.formTitle}
                    </h5>
                    <div className={styles.formFields}>
                      {viewingRequest.formData?.fields.map((field, index) => (
                        <div key={index} className={styles.formField}>
                          <label>{field.label}:</label>
                          <span>{field.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conversation Thread */}
                {viewingRequest.replies.length > 0 && (
                  <div className={styles.conversation}>
                    <h5>Conversation</h5>
                    <div className={styles.replies}>
                      {viewingRequest.replies.map((reply) => (
                        <div key={reply.id} className={styles.reply}>
                          <div className={styles.replyHeader}>
                            <strong>{reply.sentBy}</strong>
                            <span>{formatDate(reply.sentAt)}</span>
                          </div>
                          <p>{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.modalActions}>
                <button
                  onClick={() => handleStartReply(viewingRequest)}
                  className={styles.replyBtn}
                  disabled={viewingRequest.status === "closed"}
                >
                  <FiCornerDownLeft /> Reply
                </button>
                <button
                  onClick={() => handleMarkAsClosed(viewingRequest.id)}
                  className={styles.closeBtn}
                  disabled={viewingRequest.status === "closed"}
                >
                  <FiCheckCircle /> Mark as Closed
                </button>
                <button
                  onClick={() => setViewingRequest(null)}
                  className={styles.cancelBtn}
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
              <h2>Send Reply</h2>
              <button
                onClick={() => setReplyingTo(null)}
                className={styles.closeModalBtn}
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
              </div>

              <div className={styles.formGroup}>
                <label>Your Message:</label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply message here..."
                  rows="8"
                  className={styles.replyTextarea}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  onClick={handleSendReply}
                  className={styles.sendBtn}
                  disabled={!replyMessage.trim()}
                >
                  <FiSend /> Send Reply
                </button>
                <button
                  onClick={() => setReplyingTo(null)}
                  className={styles.cancelBtn}
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
