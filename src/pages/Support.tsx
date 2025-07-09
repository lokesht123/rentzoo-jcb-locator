
import { useState } from 'react';
import { Phone, MessageCircle, Mail, Clock, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const Support = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });
  const { toast } = useToast();

  const faqs = [
    {
      question: "How do I book a JCB?",
      answer: "You can book a JCB through our website by searching for available equipment in your area, selecting your preferred JCB, and completing the booking form. You can also call our support team for assistance."
    },
    {
      question: "What are the payment options?",
      answer: "We accept all major credit cards, debit cards, net banking, UPI, and digital wallets. Payment is processed securely through our encrypted payment gateway."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking up to 2 hours before the scheduled time without any charges. Cancellations within 2 hours may incur a small fee."
    },
    {
      question: "Are operators provided with the equipment?",
      answer: "Yes, all our equipment comes with certified and experienced operators. However, if you have your own operator, you can choose the equipment-only option."
    },
    {
      question: "What if the equipment breaks down?",
      answer: "All our equipment is regularly maintained and insured. In the unlikely event of a breakdown, we provide immediate replacement equipment at no extra cost."
    },
    {
      question: "How is the billing calculated?",
      answer: "Billing is calculated on an hourly basis from the time the equipment starts working at your site. We provide transparent billing with detailed breakdowns."
    },
    {
      question: "Do you provide equipment outside city limits?",
      answer: "Yes, we provide equipment services in surrounding areas. Additional transportation charges may apply based on the distance."
    },
    {
      question: "What safety measures do you follow?",
      answer: "We follow strict safety protocols including regular equipment inspections, certified operators, insurance coverage, and compliance with all safety regulations."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Support request submitted!",
      description: "We'll get back to you within 24 hours.",
    });
    setSupportForm({ name: '', email: '', subject: '', message: '', priority: 'medium' });
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-cyan-50 to-yellow-100">
      <Navigation />
      
      <div className="pt-32 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              Support Center
            </h1>
            <p className="text-lg text-gray-600">
              We're here to help you 24/7. Find answers or get in touch with our support team.
            </p>
          </div>

          {/* Quick Contact */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/60 backdrop-blur-md border-white/30 shadow-xl text-center hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-4">Talk to our support team directly</p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  +91 98765 43210
                </Button>
                <p className="text-sm text-gray-500 mt-2">Available 24/7</p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-md border-white/30 shadow-xl text-center hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">Get instant help through chat</p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Start Chat
                </Button>
                <p className="text-sm text-gray-500 mt-2">Response time: &lt;5 min</p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-md border-white/30 shadow-xl text-center hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <Mail className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                <p className="text-gray-600 mb-4">Send us your detailed queries</p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  support@rentzoo.com
                </Button>
                <p className="text-sm text-gray-500 mt-2">Response time: &lt;24 hours</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* FAQ Section */}
            <div>
              <Card className="bg-white/60 backdrop-blur-md border-white/30 shadow-xl">
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search FAQs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredFaqs.map((faq, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                          className="w-full flex items-center justify-between text-left hover:text-yellow-600 transition-colors"
                        >
                          <span className="font-medium">{faq.question}</span>
                          {expandedFaq === index ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        {expandedFaq === index && (
                          <p className="text-gray-600 mt-2">{faq.answer}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Support Form */}
            <div>
              <Card className="bg-white/60 backdrop-blur-md border-white/30 shadow-xl">
                <CardHeader>
                  <CardTitle>Submit a Support Request</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <Input
                        value={supportForm.name}
                        onChange={(e) => setSupportForm({...supportForm, name: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        type="email"
                        value={supportForm.email}
                        onChange={(e) => setSupportForm({...supportForm, email: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <Input
                        value={supportForm.subject}
                        onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Priority</label>
                      <div className="flex gap-2">
                        {['low', 'medium', 'high', 'urgent'].map((priority) => (
                          <button
                            key={priority}
                            type="button"
                            onClick={() => setSupportForm({...supportForm, priority})}
                            className={`px-3 py-1 rounded-full text-sm ${
                              supportForm.priority === priority
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <Textarea
                        value={supportForm.message}
                        onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                        rows={4}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-yellow-500 to-cyan-500 hover:from-yellow-600 hover:to-cyan-600">
                      Submit Request
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Support Hours */}
              <Card className="bg-white/60 backdrop-blur-md border-white/30 shadow-xl mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Emergency Support:</span>
                      <Badge className="bg-green-100 text-green-800">24/7</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>General Support:</span>
                      <span className="text-gray-600">6:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Technical Support:</span>
                      <span className="text-gray-600">8:00 AM - 8:00 PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Support;
