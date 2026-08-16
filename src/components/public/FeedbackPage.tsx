import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Star, Send, CheckCircle2, Shield, Heart } from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const { citizenFeedback, submitCitizenFeedback } = useApp();
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<string>('Police Visibility');
  const [comment, setComment] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const categories = [
    'Police Visibility',
    'Response Time',
    'Signal Synchronization',
    'Road Safety / Choke Point',
    'Platform Ease of Use',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    submitCitizenFeedback({
      rating,
      category,
      comment,
      citizenName: name.trim() || undefined,
    });

    setSubmitted(true);
    setComment('');
    setName('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 lg:py-16 space-y-10 select-none">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#E56B2F] bg-[#E56B2F]/10 px-3 py-1 rounded-full border border-[#E56B2F]/20">
          Community Engagement
        </span>
        <h1 className="text-3xl font-extrabold text-[#142C54] tracking-tight">
          Citizen Traffic & Platform Feedback
        </h1>
        <p className="text-xs sm:text-sm text-[#5E625F]">
          Your feedback helps Nagpur Traffic Police optimize deployment schedules and enhance safety across key corridors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Feedback Submission Form (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-[#DCDCD6] p-6 shadow-xs space-y-5">
          {submitted ? (
            <div className="p-6 text-center space-y-4 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-[#2E6B4A]/10 text-[#2E6B4A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-[#142C54]">Thank You for Your Feedback</h2>
              <p className="text-xs text-[#5E625F]">
                Your response has been added to our public civic quality metrics.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 rounded-lg bg-[#FAF8F4] border border-[#DCDCD6] text-xs font-bold text-[#142C54]"
              >
                Submit More Thoughts
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h2 className="text-sm font-extrabold text-[#142C54] uppercase tracking-wide">
                Share Your Experience
              </h2>

              {/* Star Rating */}
              <div className="space-y-1">
                <label className="font-bold text-[#142C54] block">Overall Rating:</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-lg text-yellow-400 hover:scale-110 transition-transform"
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#142C54] ml-2">{rating} / 5 Stars</span>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="font-bold text-[#142C54] block">Feedback Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#FAF8F4] border border-[#DCDCD6] text-xs"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="font-bold text-[#142C54] block">Your Name (Optional):</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Citizen / Commuter"
                  className="w-full p-2.5 rounded-lg bg-[#FAF8F4] border border-[#DCDCD6] text-xs"
                />
              </div>

              {/* Comment */}
              <div className="space-y-1">
                <label className="font-bold text-[#142C54] block">Detailed Feedback / Suggestion: <span className="text-red-500">*</span></label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about traffic management, officer assistance, or road issues you observed in Nagpur..."
                  className="w-full p-3 rounded-lg bg-[#FAF8F4] border border-[#DCDCD6] text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#E56B2F] hover:bg-[#B94A1F] text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </button>
            </form>
          )}
        </div>

        {/* Recent Citizen Feedback Stream (5 cols) */}
        <div className="md:col-span-5 space-y-3">
          <h2 className="text-sm font-extrabold text-[#142C54] uppercase tracking-wide">
            Recent Nagpur Commuter Comments
          </h2>

          <div className="space-y-3">
            {citizenFeedback.slice(0, 4).map((item) => (
              <div key={item.id} className="p-3.5 rounded-xl bg-white border border-[#DCDCD6] shadow-xs text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#142C54]">{item.citizenName}</span>
                  <div className="flex text-yellow-500 text-xs">
                    {'★'.repeat(item.rating)}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF8F4] text-[#E56B2F] border border-[#DCDCD6] inline-block">
                  {item.category}
                </span>
                <p className="text-[#5E625F] leading-relaxed text-[11px]">
                  "{item.comment}"
                </p>
                <span className="text-[10px] text-gray-400 block pt-1">{item.submittedAt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
