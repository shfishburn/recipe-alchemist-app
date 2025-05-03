
import React from 'react';
import { Navbar } from '@/components/ui/navbar';
import { PageSeo } from '@/components/seo/PageSeo';

export default function Contact() {
  return (
    <>
      <PageSeo 
        title="Contact Us | Recipe Alchemy"
        description="Have questions or feedback for Recipe Alchemy? Contact our team."
      />
      <Navbar />
      <main className="container-page py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Contact Us</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-4">
                We value your feedback and are here to answer any questions you may have about Recipe Alchemy.
              </p>
              
              <form className="space-y-4 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="What is your message about?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                  <textarea 
                    id="message" 
                    rows={5} 
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Enter your message here..."
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="bg-primary text-primary-foreground rounded-md px-4 py-2"
                >
                  Send Message
                </button>
              </form>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Other Ways to Reach Us</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Email</h3>
                  <p className="text-muted-foreground">support@recipealchemyapp.com</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Business Inquiries</h3>
                  <p className="text-muted-foreground">business@recipealchemyapp.com</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
