import React, { useState } from 'react';
import Button from '../ui/Button';
import './ContactForm.css';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  passport: string;
  destination: string;
  tourismType: string;
  specificActivities: string;
  budget: string;
  experienceLevel: string;
  additionalInfo: string;
  travelDates: string;
  referralSource: string;
  otherReferral: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    passport: '',
    destination: '',
    tourismType: '',
    specificActivities: '',
    budget: '',
    experienceLevel: '',
    additionalInfo: '',
    travelDates: '',
    referralSource: '',
    otherReferral: '',
  });

  const [step, setStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to a server
    console.log(formData);
    setFormSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (formSubmitted) {
    return (
      <div className="form-success">
        <div className="form-success-icon">✓</div>
        <h2>Thank You!</h2>
        <p>Your custom package request has been received. Our team will contact you shortly to discuss your personalized journey.</p>
        <Button 
          variant="primary"
          onClick={() => {
            setFormData({
              fullName: '',
              email: '',
              phone: '',
              country: '',
              passport: '',
              destination: '',
              tourismType: '',
              specificActivities: '',
              budget: '',
              experienceLevel: '',
              additionalInfo: '',
              travelDates: '',
              referralSource: '',
              otherReferral: '',
            });
            setFormSubmitted(false);
            setStep(1);
          }}
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <div className="contact-form-container">
      <h2 className="form-title">Custom Package Request</h2>
      <div className="form-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Personal Info</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Travel Preferences</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Additional Details</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="form-step">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Contact Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="country">Country of Residence</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="passport">Passport Details (Optional)</label>
              <input
                type="text"
                id="passport"
                name="passport"
                value={formData.passport}
                onChange={handleChange}
                placeholder="Passport number, expiry date"
              />
            </div>
            
            <div className="form-buttons">
              <Button
                variant="primary"
                type="button"
                onClick={nextStep}
              >
                Continue
              </Button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="form-step">
            <div className="form-group">
              <label>Preferred Destination</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="sri-lanka"
                    name="destination"
                    value="Sri Lanka"
                    checked={formData.destination === "Sri Lanka"}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="sri-lanka">Sri Lanka</label>
                </div>
                
                <div className="radio-option">
                  <input
                    type="radio"
                    id="thailand"
                    name="destination"
                    value="Thailand"
                    checked={formData.destination === "Thailand"}
                    onChange={handleChange}
                  />
                  <label htmlFor="thailand">Thailand</label>
                </div>
                
                <div className="radio-option">
                  <input
                    type="radio"
                    id="india"
                    name="destination"
                    value="India"
                    checked={formData.destination === "India"}
                    onChange={handleChange}
                  />
                  <label htmlFor="india">India</label>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Type of Tourism</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="medical"
                    name="tourismType"
                    value="Medical Tourism"
                    checked={formData.tourismType === "Medical Tourism"}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="medical">Medical Tourism</label>
                </div>
                
                <div className="radio-option">
                  <input
                    type="radio"
                    id="wellness"
                    name="tourismType"
                    value="Wellness Tourism"
                    checked={formData.tourismType === "Wellness Tourism"}
                    onChange={handleChange}
                  />
                  <label htmlFor="wellness">Wellness Tourism</label>
                </div>
                
                <div className="radio-option">
                  <input
                    type="radio"
                    id="education"
                    name="tourismType"
                    value="Education & Training Tourism"
                    checked={formData.tourismType === "Education & Training Tourism"}
                    onChange={handleChange}
                  />
                  <label htmlFor="education">Education & Training Tourism</label>
                </div>
                
                <div className="radio-option">
                  <input
                    type="radio"
                    id="sports"
                    name="tourismType"
                    value="Sports Tourism"
                    checked={formData.tourismType === "Sports Tourism"}
                    onChange={handleChange}
                  />
                  <label htmlFor="sports">Sports Tourism</label>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="specificActivities">Specific Activities or Programs</label>
              <textarea
                id="specificActivities"
                name="specificActivities"
                value={formData.specificActivities}
                onChange={handleChange}
                placeholder="e.g., Cosmetic Surgery, Yoga Retreat, Language Course, Cricket Training, etc."
                rows={3}
              ></textarea>
            </div>
            
            <div className="form-buttons">
              <Button
                variant="secondary"
                type="button"
                onClick={prevStep}
              >
                Back
              </Button>
              <Button
                variant="primary"
                type="button"
                onClick={nextStep}
              >
                Continue
              </Button>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="form-step">
            <div className="form-group">
              <label>Budget Preferences</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="basic"
                    name="budget"
                    value="Basic (Economical)"
                    checked={formData.budget === "Basic (Economical)"}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="basic">Basic (Economical)</label>
                </div>
                
                <div className="radio-option">
                  <input
                    type="radio"
                    id="mid-level"
                    name="budget"
                    value="Mid-Level (Comfortable)"
                    checked={formData.budget === "Mid-Level (Comfortable)"}
                    onChange={handleChange}
                  />
                  <label htmlFor="mid-level">Mid-Level (Comfortable)</label>
                </div>
                
                <div className="radio-option">
                  <input
                    type="radio"
                    id="luxury"
                    name="budget"
                    value="Luxury (Premium)"
                    checked={formData.budget === "Luxury (Premium)"}
                    onChange={handleChange}
                  />
                  <label htmlFor="luxury">Luxury (Premium)</label>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Experience Level</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="authentic"
                    name="experienceLevel"
                    value="Authentic Experience"
                    checked={formData.experienceLevel === "Authentic Experience"}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="authentic">Authentic Experience (Local transport, local cuisine)</label>
                </div>
                
                <div className="radio-option">
                  <input
                    type="radio"
                    id="comfortable"
                    name="experienceLevel"
                    value="Comfortable Experience"
                    checked={formData.experienceLevel === "Comfortable Experience"}
                    onChange={handleChange}
                  />
                  <label htmlFor="comfortable">Comfortable Experience (Mix of local and modern comforts)</label>
                </div>
                
                <div className="radio-option">
                  <input
                    type="radio"
                    id="luxury-exp"
                    name="experienceLevel"
                    value="Luxury Experience"
                    checked={formData.experienceLevel === "Luxury Experience"}
                    onChange={handleChange}
                  />
                  <label htmlFor="luxury-exp">Luxury Experience (High-end accommodations, premium services)</label>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="additionalInfo">Additional Requirements or Preferences</label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Any specific requirements or preferences you'd like us to know about..."
                rows={3}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="travelDates">Preferred Travel Dates</label>
              <input
                type="text"
                id="travelDates"
                name="travelDates"
                value={formData.travelDates}
                onChange={handleChange}
                placeholder="e.g., Jan 10-20, 2026 or Early Summer 2026"
              />
            </div>
            
            <div className="form-group">
              <label>How did you hear about us?</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="website"
                    name="referralSource"
                    value="Website"
                    checked={formData.referralSource === "Website"}
                    onChange={handleChange}
                  />
                  <label htmlFor="website">Website</label>
                </div>
                
                <div className="radio-option">
                  <input
                    type="radio"
                    id="social"
                    name="referralSource"
                    value="Social Media"
                    checked={formData.referralSource === "Social Media"}
                    onChange={handleChange}
                  />
                  <label htmlFor="social">Social Media</label>
                </div>
                
                <div className="radio-option">
                  <input
                    type="radio"
                    id="friend"
                    name="referralSource"
                    value="Friend/Family"
                    checked={formData.referralSource === "Friend/Family"}
                    onChange={handleChange}
                  />
                  <label htmlFor="friend">Friend/Family</label>
                </div>
                
                <div className="radio-option">
                  <input
                    type="radio"
                    id="other"
                    name="referralSource"
                    value="Other"
                    checked={formData.referralSource === "Other"}
                    onChange={handleChange}
                  />
                  <label htmlFor="other">Other</label>
                </div>
              </div>
            </div>
            
            {formData.referralSource === "Other" && (
              <div className="form-group">
                <label htmlFor="otherReferral">Please specify:</label>
                <input
                  type="text"
                  id="otherReferral"
                  name="otherReferral"
                  value={formData.otherReferral}
                  onChange={handleChange}
                />
              </div>
            )}
            
            <div className="form-buttons">
              <Button
                variant="secondary"
                type="button"
                onClick={prevStep}
              >
                Back
              </Button>
              <Button
                variant="primary"
                type="submit"
              >
                Submit Request
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
