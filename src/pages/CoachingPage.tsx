import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Star, MessageCircle, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import CoachingRegistrationForm from "@/components/CoachingRegistrationForm";
import CoachingHeader from "@/components/CoachingHeader";

const CoachingPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleGetStarted = () => {
    setShowForm(true);
  };

  const handleRegistrationSuccess = () => {
    setRegistrationSuccess(true);
    setShowForm(false);
  };

  const testimonials = [
    {
      name: "Ahmad Rahman",
      text: "Khairy's coaching transformed my eBay business. Sales increased by 300% in just 2 months!",
      rating: 5
    },
    {
      name: "Siti Aminah",
      text: "The personalized strategy and hands-on guidance were exactly what I needed to scale my store.",
      rating: 5
    },
    {
      name: "David Lim",
      text: "Professional, knowledgeable, and results-driven. Best investment I made for my business.",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "What's included in the coaching session?",
      answer: "A 60-minute private session covering eBay strategy, product research, listing optimization, and personalized action plan for your specific goals."
    },
    {
      question: "How is the session conducted?",
      answer: "Sessions are conducted via video call (Zoom/Google Meet) for interactive screen sharing and real-time guidance."
    },
    {
      question: "What if I'm a complete beginner?",
      answer: "Perfect! The coaching is tailored to your experience level. We'll start with the basics and build up your knowledge systematically."
    },
    {
      question: "Do you provide follow-up support?",
      answer: "Yes, you'll receive a detailed action plan and 1 week of follow-up support via WhatsApp/email for clarification questions."
    },
    {
      question: "What's your refund policy?",
      answer: "If you're not satisfied within the first 15 minutes of the session, we'll provide a full refund."
    },
    {
      question: "Will I get an account to track my progress?",
      answer: "Yes! When you register, we'll automatically create an account for you. Check your email for verification instructions to access your coaching dashboard."
    }
  ];

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <CoachingHeader />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Registration Successful!</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Thank you for registering! Your coaching session has been booked successfully.
          </p>
          <Card className="p-6 bg-blue-50 border-blue-200 mb-6">
            <h3 className="text-xl font-semibold mb-3">Account Created!</h3>
            <p className="text-muted-foreground mb-4">
              We've automatically created an account for you. Please check your email for verification instructions.
            </p>
            <div className="text-left space-y-2 text-sm text-muted-foreground">
              <p><strong>What you'll get access to:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Personal coaching dashboard</li>
                <li>Session scheduling tools</li>
                <li>Access to session recordings</li>
                <li>Progress tracking</li>
                <li>Resource library</li>
              </ul>
            </div>
          </Card>
          <Card className="p-6 bg-green-50 border-green-200">
            <h3 className="text-xl font-semibold mb-3">What's Next?</h3>
            <p className="text-muted-foreground mb-4">
              We'll contact you within 24 hours via your preferred method to:
            </p>
            <div className="text-left space-y-2 text-sm text-muted-foreground">
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Schedule your coaching session</li>
                <li>Provide payment details</li>
                <li>Share preparation materials</li>
                <li>Answer any questions you may have</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              In the meantime, verify your email and prepare any specific questions or challenges you'd like to discuss during our session.
            </p>
          </Card>
          <Link to="/" className="inline-block mt-6">
            <Button variant="outline">Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-background">
        <CoachingHeader />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <CoachingRegistrationForm 
            onSuccess={handleRegistrationSuccess}
            onBack={() => setShowForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CoachingHeader />
      
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Personal Coaching with Khairy
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Transform your eBay account with 1-on-1 coaching sessions
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>60-minute private session</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Customized strategy for your business</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Actionable insights and tactics</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>1 week follow-up support</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Personal dashboard & progress tracking</span>
              </div>
            </div>
            <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-4">
              Get Started - RM500
            </Button>
          </div>
          <div className="text-center">
            <div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6">
              <span className="text-6xl">👨‍💼</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Khairy - eBay Expert</h3>
            <p className="text-muted-foreground">
              5+ years helping businesses scale on eBay with proven strategies and personalized guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Service Highlight */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What You'll Get</h2>
          <Card className="p-8 border-2 border-primary/20 shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl">Personal Coaching Session</CardTitle>
              <CardDescription className="text-xl font-semibold text-primary">RM500</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Session Includes:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>60-minute private video call</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Screen sharing for hands-on guidance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Personalized action plan</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Recording of the session</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Personal dashboard access</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Topics Covered:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Product research strategies</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Listing optimization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Marketing and promotion</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Scaling your business</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="text-center mt-8">
                <Button size="lg" onClick={handleGetStarted} className="text-lg px-12 py-4">
                  Book Your Session Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-0">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                  <p className="font-semibold">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-0">
                  <h4 className="font-semibold text-lg mb-3">{faq.question}</h4>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join hundreds of successful eBay sellers who have transformed their businesses with personalized coaching.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>khairy@postrepublic.my</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: +60123456789</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>Call: +60123456789</span>
            </div>
          </div>
          
          <Button size="lg" onClick={handleGetStarted} className="text-lg px-12 py-4">
            Book Your Coaching Session - RM500
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CoachingPage;
