
import React from 'react';
import { Navbar } from '@/components/ui/navbar';
import { PageSeo } from '@/components/seo/PageSeo';
import { Separator } from '@/components/ui/separator';

export default function Cookies() {
  return (
    <>
      <PageSeo 
        title="Cookie Policy | Recipe Alchemy"
        description="Learn about how Recipe Alchemy uses cookies and similar technologies."
      />
      <Navbar />
      <main className="container-page py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Cookie Policy</h1>
          <p className="text-muted-foreground mb-6">Last updated: May 3, 2025</p>
          <Separator className="mb-8" />
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. What Are Cookies</h2>
              <p className="mb-3">
                Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
              </p>
              <p>
                Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your personal computer or mobile device when you go offline, while session cookies are deleted as soon as you close your web browser.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-semibold mb-3">2. How Recipe Alchemy Uses Cookies</h2>
              <p className="mb-3">
                When you use and access our Service, we may place a number of cookie files in your web browser. We use cookies for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="font-medium">Essential cookies:</span> These cookies are required for the operation of our Service. They include, for example, cookies that enable you to log into secure areas.
                </li>
                <li>
                  <span className="font-medium">Preferences cookies:</span> These cookies allow us to remember choices you make when you use our Service, such as your preferred units (metric or imperial), language preference, or region you are in.
                </li>
                <li>
                  <span className="font-medium">Analytics cookies:</span> We use these cookies to collect information about how you interact with our Service, enabling us to improve it.
                </li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-semibold mb-3">3. Cookie Management</h2>
              <p className="mb-3">
                Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience and limit certain functionality of our Service.
              </p>
              <p className="mb-3">
                If you prefer, you can choose to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Delete cookies after each browsing session</li>
                <li>Set your browser to prevent cookies from being set</li>
                <li>Use our cookie consent management tool to select your preferences</li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Contact Us</h2>
              <p>
                If you have any questions about our Cookie Policy, please contact us at <a href="mailto:privacy@recipealchemyapp.com" className="text-primary hover:underline">privacy@recipealchemyapp.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
