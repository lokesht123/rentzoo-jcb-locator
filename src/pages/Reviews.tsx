
import { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageCircle, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Reviews = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      clientName: "Rajesh Kumar",
      operatorName: "Suresh Singh",
      rating: 5,
      comment: "Excellent service! The JCB operator was very professional and completed the job efficiently.",
      jobType: "Excavation",
      date: "2024-01-15",
      verified: true,
      likes: 12,
      replies: 3
    },
    {
      id: 2,
      clientName: "Priya Sharma",
      operatorName: "Vikram Patel",
      rating: 4,
      comment: "Good work, but could have been faster. Overall satisfied with the service.",
      jobType: "Loading",
      date: "2024-01-10",
      verified: true,
      likes: 8,
      replies: 1
    },
    {
      id: 3,
      clientName: "Amit Gupta",
      operatorName: "Ravi Kumar",
      rating: 5,
      comment: "Outstanding! Very punctual and skilled operator. Highly recommend.",
      jobType: "Demolition",
      date: "2024-01-08",
      verified: true,
      likes: 15,
      replies: 2
    }
  ]);

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    jobType: ''
  });

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to submit a review",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Review submitted!",
      description: "Thank you for your feedback. It helps other users make better decisions.",
    });
    
    setNewReview({ rating: 5, comment: '', jobType: '' });
  };

  const filteredReviews = reviews.filter(review => {
    const matchesFilter = filter === 'all' || review.rating.toString() === filter;
    const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.jobType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-cyan-50 to-yellow-100">
      <Navigation />
      
      <div className="pt-32 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              Reviews & Ratings
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Real feedback from our community helps everyone make better decisions
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {renderStars(Math.round(averageRating))}
                </div>
                <span className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</span>
                <span className="text-gray-500">({reviews.length} reviews)</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-2">
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/30 mb-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search reviews..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={filter === 'all' ? 'default' : 'outline'}
                      onClick={() => setFilter('all')}
                      className="bg-gradient-to-r from-yellow-500 to-cyan-500 hover:from-yellow-600 hover:to-cyan-600"
                    >
                      All
                    </Button>
                    <Button
                      variant={filter === '5' ? 'default' : 'outline'}
                      onClick={() => setFilter('5')}
                    >
                      5 ⭐
                    </Button>
                    <Button
                      variant={filter === '4' ? 'default' : 'outline'}
                      onClick={() => setFilter('4')}
                    >
                      4 ⭐
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <Card key={review.id} className="bg-white/60 backdrop-blur-md border-white/30 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-r from-yellow-500 to-cyan-500 text-white">
                              {review.clientName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{review.clientName}</h4>
                              {review.verified && (
                                <Badge className="bg-green-100 text-green-800">Verified</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">Operator: {review.operatorName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          {review.jobType}
                        </Badge>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-yellow-600">
                            <ThumbsUp className="h-4 w-4" />
                            {review.likes}
                          </button>
                          <button className="flex items-center gap-1 text-gray-500 hover:text-cyan-600">
                            <MessageCircle className="h-4 w-4" />
                            {review.replies}
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Submit Review */}
            <div className="lg:col-span-1">
              <Card className="bg-white/60 backdrop-blur-md border-white/30 shadow-xl sticky top-32">
                <CardHeader>
                  <CardTitle className="text-center bg-gradient-to-r from-yellow-600 to-cyan-600 bg-clip-text text-transparent">
                    Write a Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }, (_, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setNewReview({...newReview, rating: index + 1})}
                            className="p-1"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                index < newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Job Type</label>
                      <Input
                        value={newReview.jobType}
                        onChange={(e) => setNewReview({...newReview, jobType: e.target.value})}
                        placeholder="e.g., Excavation, Loading"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Review</label>
                      <Textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        placeholder="Share your experience..."
                        rows={4}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-gradient-to-r from-yellow-500 to-cyan-500 hover:from-yellow-600 hover:to-cyan-600">
                      Submit Review
                    </Button>
                  </form>
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

export default Reviews;
