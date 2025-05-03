
import React from 'react';
import { Navbar } from '@/components/ui/navbar';
import { PageSeo } from '@/components/seo/PageSeo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Contact() {
  return (
    <>
      <PageSeo 
        title="Contact Us | Recipe Alchemy"
        description="Have questions or feedback for Recipe Alchemy? Contact our team."
      />
      <Navbar />
      <main className="container-page py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Contact Us</h1>
          
          <div className="space-y-6">
            <section className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-6">
                We value your feedback and are here to answer any questions you may have about Recipe Alchemy.
              </p>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                    <Input 
                      type="text" 
                      id="name" 
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                    <Input 
                      type="email" 
                      id="email" 
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                  <Input 
                    type="text" 
                    id="subject" 
                    placeholder="What is your message about?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                  <Textarea 
                    id="message" 
                    rows={5} 
                    placeholder="Enter your message here..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button type="submit">
                  Send Message
                </Button>
              </form>
            </section>
            
            <section className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Other Ways to Reach Us</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Support Email</h3>
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
