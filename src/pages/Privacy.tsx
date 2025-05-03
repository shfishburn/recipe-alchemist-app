
import React from 'react';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { PageSeo } from '@/components/seo/PageSeo';

export default function Privacy() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageSeo 
        title="Privacy Policy | Recipe Alchemy"
        description="Learn about how Recipe Alchemy collects, uses, and protects your personal information."
      />
      <Navbar />
      
      <main className="flex-1">
        <div className="container-page py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6">Privacy Policy</h1>
            
            <div className="prose prose-sm sm:prose-base max-w-none">
              <p className="text-muted-foreground mb-6">Last updated: May 3, 2025</p>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="mb-4">
                  Recipe Alchemy ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                </p>
                <p>
                  Please read this Privacy Policy carefully. By accessing or using our service, you acknowledge that you have read, understood, and agree to be bound by all the terms outlined in this Privacy Policy.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                <h3 className="text-xl font-medium mb-3">2.1 Personal Data</h3>
                <p className="mb-2">
                  We may collect personally identifiable information, such as:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Account credentials</li>
                  <li>User preferences and dietary information</li>
                  <li>Payment information when applicable</li>
                </ul>
                
                <h3 className="text-xl font-medium mb-3">2.2 Usage Data</h3>
                <p className="mb-2">
                  We may also collect information about how you access and use our service, including:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Pages visited and time spent</li>
                  <li>Unique device identifiers</li>
                  <li>IP addresses</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                <p className="mb-2">
                  We use the collected data for various purposes:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>To provide and maintain our service</li>
                  <li>To notify you about changes to our service</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis or valuable information so that we can improve our service</li>
                  <li>To monitor the usage of our service</li>
                  <li>To detect, prevent and address technical issues</li>
                  <li>To personalize your experience and deliver content relevant to your preferences</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Cookies and Tracking Technologies</h2>
                <p>
                  We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Third-Party Services</h2>
                <p>
                  Our service may contain links to third-party websites or services that are not owned or controlled by Recipe Alchemy. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Changes to This Privacy Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@recipealchemyapp.com" className="text-primary hover:underline">privacy@recipealchemyapp.com</a>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
