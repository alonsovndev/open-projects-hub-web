import type { FC } from "react";
import { Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import styles from "./privacy-page.module.scss";

const { Title, Paragraph } = Typography;

export const PrivacyPage: FC = () => {
  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backLink}>
        <ArrowLeftOutlined /> Back to Home
      </Link>
      <Title level={1} className={styles.pageTitle}>
        Privacy Policy
      </Title>

      <Paragraph className={styles.pageContent}>
        Open Projects Hub (&ldquo;the Service&rdquo;) is an open-source project management and
        requirements refinement platform. This Privacy Policy explains how we collect, use, store,
        and protect your information when you use the Service.
      </Paragraph>

      {/* 1. Introduction */}
      <Title level={2} className={styles.sectionTitle}>
        1. Introduction
      </Title>
      <Paragraph className={styles.pageContent}>
        We are committed to protecting your privacy. This policy applies to all users of the
        Service, including freelancers with authenticated accounts and their clients who review
        projects via project access codes. By using the Service, you consent to the practices
        described in this policy.
      </Paragraph>

      {/* 2. Data We Collect */}
      <Title level={2} className={styles.sectionTitle}>
        2. Data We Collect
      </Title>
      <Paragraph className={styles.pageContent}>
        We collect only the information necessary to provide the Service:
      </Paragraph>
      <Paragraph className={styles.pageContent}>
        <strong>Account information.</strong> When you create an admin account, we collect your
        email address and display name. Passwords are stored in hashed form and are never accessible
        in plain text.
      </Paragraph>
      <Paragraph className={styles.pageContent}>
        <strong>Session data.</strong> Authentication tokens and refresh tokens are managed securely
        during your session. Tokens are not persisted in browser storage by default and are cleared
        when you log out or close your session.
      </Paragraph>
      <Paragraph className={styles.pageContent}>
        <strong>Project and story data.</strong> All projects, stories, backlog items, notes, and
        related content you create or upload are stored to provide the Service. This includes
        project names, codes, descriptions, status, priorities, story points, and acceptance
        criteria.
      </Paragraph>
      <Paragraph className={styles.pageContent}>
        <strong>Client information.</strong> If you add client records, we store the name, email,
        phone, company, address, and notes you provide for project association purposes.
      </Paragraph>
      <Paragraph className={styles.pageContent}>
        <strong>AI input data.</strong> When you use the AI-powered refinement feature, the raw text
        you submit is sent to our AI processing service for story generation. We do not store raw AI
        input separately from your project data.
      </Paragraph>

      {/* 3. How We Use Data */}
      <Title level={2} className={styles.sectionTitle}>
        3. How We Use Data
      </Title>
      <Paragraph className={styles.pageContent}>
        We use the data we collect to: provide and maintain the Service; authenticate users and
        manage access control; process AI refinement requests and generate story drafts; enable
        project sharing via client review access; communicate with you about your account or the
        Service; detect and prevent security incidents or abuse.
      </Paragraph>
      <Paragraph className={styles.pageContent}>
        We do not use your data for advertising, marketing, profiling, or any purpose unrelated to
        providing the Service.
      </Paragraph>

      {/* 4. AI Data Processing */}
      <Title level={2} className={styles.sectionTitle}>
        4. AI Data Processing
      </Title>
      <Paragraph className={styles.pageContent}>
        The AI-powered refinement feature processes your input text to generate structured user
        stories. Important details about AI processing:
      </Paragraph>
      <Paragraph className={styles.pageContent}>
        Your input text is transmitted to our AI processing service solely for generating story
        drafts. We do not use your input to train or improve AI models. AI-generated outputs are
        returned to you as drafts and are stored as part of your project data. You are responsible
        for reviewing and approving AI-generated content before it enters your backlog.
      </Paragraph>

      {/* 5. Data Storage and Security */}
      <Title level={2} className={styles.sectionTitle}>
        5. Data Storage and Security
      </Title>
      <Paragraph className={styles.pageContent}>
        We implement industry-standard security measures to protect your data: passwords are hashed
        using secure algorithms; authentication tokens are short-lived and not persisted in browser
        storage by default; data transmission is encrypted via TLS; access to the Service is
        controlled through role-based permissions (admin, member).
      </Paragraph>
      <Paragraph className={styles.pageContent}>
        As an open-source project, our code is publicly auditable, which provides additional
        transparency and community-driven security review.
      </Paragraph>

      {/* 6. Data Sharing */}
      <Title level={2} className={styles.sectionTitle}>
        6. Data Sharing
      </Title>
      <Paragraph className={styles.pageContent}>
        We do not sell, rent, or share your personal data with third parties for their marketing
        purposes. Your data may be shared only in the following limited circumstances: with your
        explicit consent; to comply with legal obligations or valid legal process; to protect the
        rights, property, or safety of Open Projects Hub, our users, or the public.
      </Paragraph>
      <Paragraph className={styles.pageContent}>
        Project data visible to clients is limited to approved stories for the specific project they
        access via its project access code. Clients cannot access account data, drafts, or other
        projects.
      </Paragraph>

      {/* 7. Cookies and Sessions */}
      <Title level={2} className={styles.sectionTitle}>
        7. Cookies and Sessions
      </Title>
      <Paragraph className={styles.pageContent}>
        The Service uses only essential session cookies required for authentication and security. We
        do not use tracking cookies, analytics cookies, advertising cookies, or any third-party
        tracking technologies. Session cookies are cleared when you log out or close your browser.
      </Paragraph>

      {/* 8. Data Retention */}
      <Title level={2} className={styles.sectionTitle}>
        8. Data Retention
      </Title>
      <Paragraph className={styles.pageContent}>
        We retain your data for as long as your account is active or as needed to provide the
        Service. When you delete your account, we will remove your personal information and project
        data within a reasonable timeframe. Some data may be retained briefly for backup recovery
        purposes before permanent deletion.
      </Paragraph>

      {/* 9. Your Rights */}
      <Title level={2} className={styles.sectionTitle}>
        9. Your Rights
      </Title>
      <Paragraph className={styles.pageContent}>
        You have the following rights regarding your data: access your personal information and
        project data; correct or update inaccurate information; delete your account and associated
        data. You can update your profile in Settings; for access or deletion requests, contact us
        directly.
      </Paragraph>

      {/* 10. Changes to This Policy */}
      <Title level={2} className={styles.sectionTitle}>
        10. Changes to This Policy
      </Title>
      <Paragraph className={styles.pageContent}>
        We may update this Privacy Policy from time to time to reflect changes in our practices or
        legal requirements. When we make material changes, we will update the &ldquo;Last
        updated&rdquo; date at the bottom of this page. Your continued use of the Service after
        changes are posted constitutes acceptance of the updated policy.
      </Paragraph>

      {/* 11. Contact */}
      <Title level={2} className={styles.sectionTitle}>
        11. Contact
      </Title>
      <Paragraph className={styles.pageContent}>
        If you have questions, concerns, or requests regarding this Privacy Policy or your personal
        data, please contact us through the Open Projects Hub platform or reach out to our support
        team. We aim to respond to all privacy-related inquiries within a reasonable timeframe.
      </Paragraph>

      <Paragraph className={styles.lastUpdated}>Last updated: May 30, 2026</Paragraph>
    </div>
  );
};

export default PrivacyPage;
