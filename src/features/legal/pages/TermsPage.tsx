import type { FC } from "react";
import { Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import styles from "./terms-page.module.scss";

const { Title, Paragraph } = Typography;

export const TermsPage: FC = () => {
  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backLink}>
        <ArrowLeftOutlined /> Back to Home
      </Link>
      <Title level={1} className={styles.pageTitle}>
        Terms and Conditions
      </Title>

      <Paragraph className={styles.pageContent}>
        Welcome to Open Projects Hub. These Terms and Conditions govern your use of our project
        management and requirements refinement platform. By accessing or using the service, you
        agree to be bound by these terms.
      </Paragraph>

      {/* 1. Acceptance of Terms */}
      <Title level={2} className={styles.sectionTitle}>
        1. Acceptance of Terms
      </Title>
      <Paragraph className={styles.pageContent}>
        By creating an account, accessing, or using Open Projects Hub (&ldquo;the Service&rdquo;),
        you acknowledge that you have read, understood, and agree to be bound by these Terms and
        Conditions. If you are using the Service on behalf of an organization, you represent that
        you have the authority to bind that organization to these terms. If you do not agree to
        these terms, you must not access or use the Service.
      </Paragraph>

      {/* 2. Description of Service */}
      <Title level={2} className={styles.sectionTitle}>
        2. Description of Service
      </Title>
      <Paragraph className={styles.pageContent}>
        Open Projects Hub is a project management and requirements refinement platform that helps
        teams transform unstructured notes into approved user stories. The Service includes, but is
        not limited to:
      </Paragraph>
      <Paragraph className={styles.pageContent}>
        Project creation and management with status tracking and priority assignment. Backlog
        management for organizing and prioritizing user stories. AI-powered story refinement that
        generates structured user stories with acceptance criteria from raw input. Client-facing
        read-only views for sharing approved stories with external stakeholders via project codes.
        Dashboard analytics for tracking project progress and team performance.
      </Paragraph>

      {/* 3. User Accounts and Roles */}
      <Title level={2} className={styles.sectionTitle}>
        3. User Accounts and Roles
      </Title>
      <Paragraph className={styles.pageContent}>
        The Service offers different access roles with distinct capabilities:
      </Paragraph>
      <Paragraph className={styles.pageContent}>
        <strong>Admin users</strong> must create an account with a valid email address and password.
        Admins have full access to project management, backlog refinement, AI story generation, and
        team settings. You are responsible for maintaining the confidentiality of your account
        credentials and for all activities that occur under your account.
      </Paragraph>
      <Paragraph className={styles.pageContent}>
        <strong>Client viewers</strong> access the Service through project codes without creating an
        account. Viewer access is read-only and limited to viewing approved stories for the
        specified project. Project codes are provided by admin users and may be revoked at any time.
      </Paragraph>

      {/* 4. User Responsibilities */}
      <Title level={2} className={styles.sectionTitle}>
        4. User Responsibilities
      </Title>
      <Paragraph className={styles.pageContent}>
        You agree to: provide accurate and complete information when creating your account; maintain
        and update your account information as needed; keep your account credentials secure and not
        share them with others; notify us immediately of any unauthorized use of your account; use
        the Service in compliance with all applicable laws and regulations; not use the Service for
        any unlawful, harmful, or malicious purpose; not attempt to gain unauthorized access to any
        part of the Service or its infrastructure; not interfere with or disrupt the Service or
        servers connected to the Service.
      </Paragraph>

      {/* 5. AI-Generated Content */}
      <Title level={2} className={styles.sectionTitle}>
        5. AI-Generated Content
      </Title>
      <Paragraph className={styles.pageContent}>
        The Service includes AI-powered features that generate user stories, acceptance criteria,
        and related content from input text. Important disclaimers regarding AI-generated content:
      </Paragraph>
      <Paragraph className={styles.pageContent}>
        AI-generated stories are drafts that require human review and approval before they become
        part of your project backlog. We do not guarantee the accuracy, completeness, or suitability
        of AI-generated content. You are solely responsible for reviewing, validating, and approving
        any AI-generated content before use. AI-generated content should not be considered
        professional advice, and we disclaim any liability for decisions made based on such content.
      </Paragraph>

      {/* 6. Intellectual Property */}
      <Title level={2} className={styles.sectionTitle}>
        6. Intellectual Property
      </Title>
      <Paragraph className={styles.pageContent}>
        <strong>Your content.</strong> You retain full ownership of all project data, stories,
        notes, and other content you create or upload to the Service. We do not claim ownership over
        your intellectual property.
      </Paragraph>
      <Paragraph className={styles.pageContent}>
        <strong>Our platform.</strong> The Service, including its design, code, features, and
        documentation, is owned by Open Projects Hub and protected by intellectual property laws.
        These terms do not grant you any rights to use our trademarks, logos, or brand elements
        without prior written consent.
      </Paragraph>

      {/* 7. Data Handling */}
      <Title level={2} className={styles.sectionTitle}>
        7. Data Handling
      </Title>
      <Paragraph className={styles.pageContent}>
        We collect and process data in accordance with our Privacy Policy. By using the Service, you
        consent to such processing. Key points: account information (email, display name) is used
        for authentication and service delivery; project and story data is stored to provide the
        Service and is not shared with third parties; authentication tokens are managed securely and
        are not persisted in browser storage by default; you may request deletion of your account
        and associated data at any time.
      </Paragraph>

      {/* 8. Service Availability */}
      <Title level={2} className={styles.sectionTitle}>
        8. Service Availability
      </Title>
      <Paragraph className={styles.pageContent}>
        We strive to maintain high availability of the Service, but we do not guarantee
        uninterrupted or error-free operation. The Service may be temporarily unavailable due to
        scheduled maintenance, updates, or circumstances beyond our reasonable control. We are not
        liable for any loss or damage resulting from service interruptions or downtime.
      </Paragraph>

      {/* 9. Limitation of Liability */}
      <Title level={2} className={styles.sectionTitle}>
        9. Limitation of Liability
      </Title>
      <Paragraph className={styles.pageContent}>
        To the maximum extent permitted by law, Open Projects Hub and its affiliates, officers,
        directors, employees, and agents shall not be liable for any indirect, incidental, special,
        consequential, or punitive damages, including but not limited to loss of profits, data,
        business opportunities, or goodwill, arising out of or related to your use of or inability
        to use the Service, regardless of the theory of liability.
      </Paragraph>
      <Paragraph className={styles.pageContent}>
        The Service is provided free of charge on an &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo; basis without warranties of any kind, whether express or implied. Open
        Projects Hub disclaims all warranties, including implied warranties of merchantability,
        fitness for a particular purpose, and non-infringement.
      </Paragraph>

      {/* 10. Termination */}
      <Title level={2} className={styles.sectionTitle}>
        10. Termination
      </Title>
      <Paragraph className={styles.pageContent}>
        You may terminate your account at any time by contacting us or using the account deletion
        feature in settings. We reserve the right to suspend or terminate your access to the Service
        at our discretion, with or without notice, for conduct that we believe violates these terms
        or is harmful to other users, the Service, or third parties. Upon termination, your right to
        use the Service ceases immediately. We will retain your data for a reasonable period to
        allow export, after which it may be deleted.
      </Paragraph>

      {/* 11. Changes to Terms */}
      <Title level={2} className={styles.sectionTitle}>
        11. Changes to Terms
      </Title>
      <Paragraph className={styles.pageContent}>
        We may update these Terms and Conditions from time to time to reflect changes in our
        practices, legal requirements, or service features. When we make material changes, we will
        update the &ldquo;Last updated&rdquo; date at the bottom of this page. Your continued use of
        the Service after any changes constitutes acceptance of the updated terms. We encourage you
        to review these terms periodically.
      </Paragraph>

      {/* 12. Contact */}
      <Title level={2} className={styles.sectionTitle}>
        12. Contact
      </Title>
      <Paragraph className={styles.pageContent}>
        If you have questions, concerns, or requests regarding these Terms and Conditions, please
        contact us through the Open Projects Hub platform or reach out to our support team. We aim
        to respond to all inquiries within a reasonable timeframe.
      </Paragraph>

      <Paragraph className={styles.lastUpdated}>Last updated: May 30, 2026</Paragraph>
    </div>
  );
};

export default TermsPage;
