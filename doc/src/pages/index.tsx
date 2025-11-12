import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="MSW Tryout project documentation">
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        textAlign: 'center',
        padding: '2rem',
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          MSW Tryout Documentation
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem', maxWidth: '800px' }}>
          Technical documentation for MSW (Mock Service Worker) tryout project featuring
          Netlify Functions, Next.js 15, and image gallery with pagination.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            className="button button--primary button--lg"
            to="/docs/intro">
            Get Started →
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/api/msw-tryout">
            API Reference →
          </Link>
        </div>
      </main>
    </Layout>
  );
}
