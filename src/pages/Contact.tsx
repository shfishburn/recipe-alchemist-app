import React, { useState } from 'react';
import { PageSeo } from '@/components/seo/PageSeo';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { PageContainer } from '@/components/ui/containers';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <PageContainer variant="narrow">
      <PageSeo 
        title="Contact Us | Recipe Alchemy"
        description="Have questions or feedback for Recipe Alchemy? Contact our team."
      />
      
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Contact Us</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              We value your feedback and are here to answer any questions you may have about Recipe Alchemy.
            </p>
            
            <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1.5">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1.5">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="What is your message about?"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1.5">Message</label>
                <textarea 
                  id="message" 
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[120px]"
                  placeholder="Enter your message here..."
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </section>
          
          <section className="pt-4">
            <h2 className="text-2xl font-semibold mb-4">Other Ways to Reach Us</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2">Email</h3>
                <p className="text-muted-foreground">
                  <a href="mailto:support@recipealchemyapp.com" className="hover:text-primary">
                    support@recipealchemyapp.com
                  </a>
                </p>
              </div>
              
              <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="font-medium mb-2">Business Inquiries</h3>
                <p className="text-muted-foreground">
                  <a href="mailto:business@recipealchemyapp.com" className="hover:text-primary">
                    business@recipealchemyapp.com
                  </a>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
