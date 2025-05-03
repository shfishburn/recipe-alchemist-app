
import React from 'react';
import { Navbar } from '@/components/ui/navbar';
import { PageSeo } from '@/components/seo/PageSeo';

export default function Terms() {
  return (
    <>
      <PageSeo 
        title="Terms of Service | Recipe Alchemy"
        description="Review the Terms of Service for using Recipe Alchemy."
      />
      <Navbar />
      <main className="container-page py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Terms of Service</h1>
          
          <div className="prose prose-sm sm:prose max-w-none">
            <p className="text-muted-foreground mb-6">Last updated: May 3, 2025</p>
            
            <section className="mb-8">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using Recipe Alchemy ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>2. Description of Service</h2>
              <p>
                Recipe Alchemy provides a platform for AI-powered recipe creation, personalization, and nutrition tracking. The Service may include various features and tools that are subject to change at our discretion.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>3. User Accounts</h2>
              <p>
                When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password and for all activities that occur under your account.
              </p>
              <p>
                You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>4. User Content</h2>
              <p>
                Our Service allows you to post, link, store, share, and otherwise make available certain information, text, graphics, or other material. You retain any and all of your rights to any content you submit, post, or display on or through the Service.
              </p>
              <p>
                By posting content to the Service, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the Service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>5. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive property of Recipe Alchemy and its licensors. The Service is protected by copyright, trademark, and other laws.
              </p>
              <p>
                Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Recipe Alchemy.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>6. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms.
              </p>
              <p>
                Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>7. Limitation of Liability</h2>
              <p>
                In no event shall Recipe Alchemy, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>8. Disclaimer</h2>
              <p>
                Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>9. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions.
              </p>
              <p>
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>10. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>11. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at <a href="mailto:terms@recipealchemyapp.com">terms@recipealchemyapp.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
