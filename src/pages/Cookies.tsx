
import React from 'react';
import { Navbar } from '@/components/ui/navbar';
import { PageSeo } from '@/components/seo/PageSeo';

export default function Cookies() {
  return (
    <>
      <PageSeo 
        title="Cookie Policy | Recipe Alchemy"
        description="Learn about how Recipe Alchemy uses cookies and similar technologies."
      />
      <Navbar />
      <main className="container-page py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Cookie Policy</h1>
          
          <div className="prose prose-sm sm:prose max-w-none">
            <p className="text-muted-foreground mb-6">Last updated: May 3, 2025</p>
            
            <section className="mb-8">
              <h2>1. What Are Cookies</h2>
              <p>
                Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
              </p>
              <p>
                Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your personal computer or mobile device when you go offline, while session cookies are deleted as soon as you close your web browser.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>2. How Recipe Alchemy Uses Cookies</h2>
              <p>
                When you use and access our Service, we may place a number of cookie files in your web browser. We use cookies for the following purposes:
              </p>
              <ul>
                <li>
                  <strong>Essential cookies:</strong> These cookies are required for the operation of our Service. They include, for example, cookies that enable you to log into secure areas.
                </li>
                <li>
                  <strong>Preferences cookies:</strong> These cookies allow us to remember choices you make when you use our Service, such as your preferred units (metric or imperial), language preference, or region you are in. They are designed to provide enhanced, more personal features.
                </li>
                <li>
                  <strong>Analytics cookies:</strong> We use these cookies to collect information about how you interact with our Service, enabling us to improve it. These cookies do not collect information that identifies you directly.
                </li>
                <li>
                  <strong>Functionality cookies:</strong> These cookies enable the Service to remember your previously selected preferences to provide enhanced features.
                </li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2>3. What Types of Cookies We Use</h2>
              <h3>3.1 First-party Cookies</h3>
              <p>
                We use first-party cookies for storing your preferences such as unit system choice (metric or imperial), user authentication, and session management.
              </p>
              
              <h3>3.2 Third-party Cookies</h3>
              <p>
                Our Service may use third-party services that set their own cookies, such as Google Analytics, to help us understand how visitors use our site.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>4. Cookie Management</h2>
              <p>
                Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience and limit certain functionality of our Service.
              </p>
              <p>
                If you prefer, you can choose to:
              </p>
              <ul>
                <li>Delete cookies after each browsing session</li>
                <li>Set your browser to prevent cookies from being set</li>
                <li>Use our cookie consent management tool to select your preferences</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2>5. Essential Cookies We Use</h2>
              <p>
                These cookies are strictly necessary for our Service to function properly and cannot be switched off in our systems:
              </p>
              <ul>
                <li><strong>auth:</strong> For authentication and session management</li>
                <li><strong>csrfToken:</strong> For security purposes to prevent cross-site request forgery</li>
                <li><strong>units:</strong> To store your preferred unit system</li>
                <li><strong>cookieConsent:</strong> To remember your cookie preferences</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2>6. Changes to This Cookie Policy</h2>
              <p>
                We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
              </p>
              <p>
                You are advised to review this Cookie Policy periodically for any changes. Changes to this Cookie Policy are effective when they are posted on this page.
              </p>
            </section>
            
            <section className="mb-8">
              <h2>7. Contact Us</h2>
              <p>
                If you have any questions about our Cookie Policy, please contact us at <a href="mailto:privacy@recipealchemyapp.com">privacy@recipealchemyapp.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
