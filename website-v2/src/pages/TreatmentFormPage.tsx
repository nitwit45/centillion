import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, ArrowRight, ArrowLeft, Save, Send } from 'lucide-react';

interface TreatmentFormData {
  // Personal Info
  dateOfBirth: string;
  gender: string;
  occupation: string;

  // Purpose of Visit
  purposeOfVisit: string[];

  // Surgical Treatments
  facialSurgeries: string[];
  bodyContouring: string[];
  breastChest: string[];
  buttocksHips: string[];

  // Non-Surgical Treatments
  facialSkin: string[];
  bodyShape: string[];
  hairAntiAging: string[];

  // Transgender Treatments
  transgenderTreatments: string[];

  // Additional Information
  previousProcedures: boolean;
  previousProceduresDetails: string;
  medicalConditions: string;
  preferredMonth: string;
  includeSightseeing: boolean;
}

const TreatmentFormPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TreatmentFormData>({
    dateOfBirth: '',
    gender: '',
    occupation: '',
    purposeOfVisit: [],
    facialSurgeries: [],
    bodyContouring: [],
    breastChest: [],
    buttocksHips: [],
    facialSkin: [],
    bodyShape: [],
    hairAntiAging: [],
    transgenderTreatments: [],
    previousProcedures: false,
    previousProceduresDetails: '',
    medicalConditions: '',
    preferredMonth: '',
    includeSightseeing: false,
  });

  useEffect(() => {
    // Load saved form data
    if (user) {
      const saved = localStorage.getItem(`treatment_form_${user.id}`);
      if (saved) {
        setFormData(JSON.parse(saved));
      }
    }
  }, [user]);

  const saveDraft = () => {
    if (user) {
      localStorage.setItem(`treatment_form_${user.id}`, JSON.stringify(formData));
      alert('Draft saved successfully!');
    }
  };

  const handleCheckboxChange = (category: keyof TreatmentFormData, value: string) => {
    const currentArray = formData[category] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setFormData({ ...formData, [category]: newArray });
  };

  const handleSubmit = () => {
    if (user) {
      localStorage.setItem(`treatment_form_${user.id}`, JSON.stringify(formData));
      updateUser({
        beautyFormSubmitted: true,
        beautyFormStatus: 'submitted',
      });
      setStep(7); // Success screen
    }
  };

  // Show form based on purpose selections
  const showSurgicalTreatments = formData.purposeOfVisit.includes('Cosmetic Surgery');
  const showNonSurgicalTreatments = formData.purposeOfVisit.includes('Non-Surgical Beauty Treatment');
  const showTransgenderTreatments = formData.purposeOfVisit.includes('Gender-Affirming or Transgender Transformation');

  // Calculate which steps are actually needed
  const getActiveSteps = () => {
    const steps = [1, 2]; // Step 1 and 2 are always shown
    if (showSurgicalTreatments) steps.push(3);
    if (showNonSurgicalTreatments) steps.push(4);
    if (showTransgenderTreatments) steps.push(5);
    steps.push(6); // Step 6 is always shown
    return steps;
  };

  const activeSteps = getActiveSteps();
  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  // Navigate to next active step
  const goToNextStep = () => {
    const currentIndex = activeSteps.indexOf(step);
    if (currentIndex < activeSteps.length - 1) {
      setStep(activeSteps[currentIndex + 1]);
    }
  };

  // Navigate to previous active step
  const goToPreviousStep = () => {
    const currentIndex = activeSteps.indexOf(step);
    if (currentIndex > 0) {
      setStep(activeSteps[currentIndex - 1]);
    }
  };

  if (user?.beautyFormStatus === 'submitted' || user?.beautyFormStatus === 'under_review' || step === 7) {
    return (
      <div className="space-y-6">
        <Card className="mx-auto max-w-2xl border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5 text-center">
          <CardContent className="p-12">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mb-4 text-3xl font-bold">Form Submitted Successfully!</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Thank you for completing the Beauty Enhancement Treatment Form. Our medical team is reviewing your request and will contact you within 2-3 business days.
            </p>
            <Badge variant="outline" className="mb-6">
              Status: {user?.beautyFormStatus.replace('_', ' ').toUpperCase()}
            </Badge>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                Back to Dashboard
              </Button>
              <Button onClick={() => setStep(1)}>
                View Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Beauty Enhancement Treatment Form</h1>
        <p className="text-muted-foreground">
          Complete this comprehensive form to help us understand your beauty enhancement goals.
        </p>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Steps */}
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && 'Personal Information'}
            {step === 2 && 'Purpose of Your Visit'}
            {step === 3 && 'Surgical Beauty Treatments'}
            {step === 4 && 'Non-Surgical Beauty Treatments'}
            {step === 5 && 'Transgender & Gender-Affirming Treatments'}
            {step === 6 && 'Additional Information & Preferences'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Tell us about yourself'}
            {step === 2 && 'Select all that apply to your visit'}
            {step === 3 && 'Select the surgical procedures you are interested in'}
            {step === 4 && 'Select the non-surgical treatments you would like'}
            {step === 5 && 'Confidential and professional consultation'}
            {step === 6 && 'Final details to complete your request'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth / Age *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Gender *</Label>
                <RadioGroup>
                  {['Female', 'Male', 'Transgender', 'Prefer not to say'].map((option) => (
                    <div key={option} className="flex items-center space-x-2 rounded-lg border p-3">
                      <RadioGroupItem
                        value={option}
                        id={option}
                        name="gender"
                        checked={formData.gender === option}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        required
                      />
                      <Label htmlFor={option} className="flex-1 cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation *</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  required
                  placeholder="Your occupation"
                />
              </div>
            </div>
          )}

          {/* Step 2: Purpose of Visit */}
          {step === 2 && (
            <div className="space-y-3">
              <Label>Please select all that apply *</Label>
              {[
                'Cosmetic Surgery',
                'Non-Surgical Beauty Treatment',
                'Wellness & Detox Program',
                'Gender-Affirming or Transgender Transformation',
                'Rejuvenation / Anti-Aging Package'
              ].map((purpose) => (
                <div key={purpose} className="flex items-center space-x-2 rounded-lg border p-3">
                  <input
                    type="checkbox"
                    id={purpose}
                    checked={formData.purposeOfVisit.includes(purpose)}
                    onChange={() => handleCheckboxChange('purposeOfVisit', purpose)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor={purpose} className="flex-1 cursor-pointer">{purpose}</Label>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Surgical Treatments */}
          {step === 3 && (
            <div className="space-y-6">
              {showSurgicalTreatments ? (
                <>
                  {/* Face & Neck */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Face & Neck</h3>
                    {[
                      'Facelift',
                      'Eyelid Surgery (Blepharoplasty)',
                      'Brow Lift',
                      'Rhinoplasty (Nose Reshaping)',
                      'Chin or Jawline Contouring',
                      'Neck Lift',
                      'Ear Correction (Otoplasty)'
                    ].map((treatment) => (
                      <div key={treatment} className="flex items-center space-x-2 rounded-lg border p-3">
                        <input
                          type="checkbox"
                          id={treatment}
                          checked={formData.facialSurgeries.includes(treatment)}
                          onChange={() => handleCheckboxChange('facialSurgeries', treatment)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor={treatment} className="flex-1 cursor-pointer">{treatment}</Label>
                      </div>
                    ))}
                  </div>

                  {/* Body Contouring */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Body Contouring</h3>
                    {[
                      'Liposuction',
                      'Tummy Tuck (Abdominoplasty)',
                      'Arm Lift',
                      'Thigh Lift',
                      'Body Sculpting / Fat Transfer'
                    ].map((treatment) => (
                      <div key={treatment} className="flex items-center space-x-2 rounded-lg border p-3">
                        <input
                          type="checkbox"
                          id={treatment}
                          checked={formData.bodyContouring.includes(treatment)}
                          onChange={() => handleCheckboxChange('bodyContouring', treatment)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor={treatment} className="flex-1 cursor-pointer">{treatment}</Label>
                      </div>
                    ))}
                  </div>

                  {/* Breast & Chest */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Breast & Chest</h3>
                    {[
                      'Breast Augmentation',
                      'Breast Lift / Firming',
                      'Breast Reduction',
                      'Male Chest Sculpting / Gynecomastia Surgery'
                    ].map((treatment) => (
                      <div key={treatment} className="flex items-center space-x-2 rounded-lg border p-3">
                        <input
                          type="checkbox"
                          id={treatment}
                          checked={formData.breastChest.includes(treatment)}
                          onChange={() => handleCheckboxChange('breastChest', treatment)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor={treatment} className="flex-1 cursor-pointer">{treatment}</Label>
                      </div>
                    ))}
                  </div>

                  {/* Buttocks & Hips */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Buttocks & Hips</h3>
                    {[
                      'Buttock Lift / Firming',
                      'Brazilian Butt Lift (BBL)',
                      'Fat Transfer to Hips'
                    ].map((treatment) => (
                      <div key={treatment} className="flex items-center space-x-2 rounded-lg border p-3">
                        <input
                          type="checkbox"
                          id={treatment}
                          checked={formData.buttocksHips.includes(treatment)}
                          onChange={() => handleCheckboxChange('buttocksHips', treatment)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor={treatment} className="flex-1 cursor-pointer">{treatment}</Label>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You did not select "Cosmetic Surgery" in Step 2.</p>
                  <p className="text-sm mt-2">This section is optional. Click Continue to proceed to the next section.</p>
                  <Button variant="link" onClick={() => setStep(2)} className="mt-2">
                    Go back to select Cosmetic Surgery
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Non-Surgical Treatments */}
          {step === 4 && (
            <div className="space-y-6">
              {showNonSurgicalTreatments ? (
                <>
                  {/* Facial & Skin */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Facial & Skin</h3>
                    {[
                      'Botox',
                      'Dermal Fillers',
                      'PRP (Platelet Rich Plasma) Therapy',
                      'Thread Lift',
                      'Laser Skin Rejuvenation',
                      'Chemical Peel',
                      'Acne / Scar Treatment',
                      'Pigmentation / Whitening Treatment'
                    ].map((treatment) => (
                      <div key={treatment} className="flex items-center space-x-2 rounded-lg border p-3">
                        <input
                          type="checkbox"
                          id={treatment}
                          checked={formData.facialSkin.includes(treatment)}
                          onChange={() => handleCheckboxChange('facialSkin', treatment)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor={treatment} className="flex-1 cursor-pointer">{treatment}</Label>
                      </div>
                    ))}
                  </div>

                  {/* Body & Shape */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Body & Shape</h3>
                    {[
                      'Cryolipolysis (Fat Freeze)',
                      'Body Sculpting (Ultrasound / RF)',
                      'Skin Tightening & Firming',
                      'Stretch Mark Removal',
                      'Cellulite Reduction'
                    ].map((treatment) => (
                      <div key={treatment} className="flex items-center space-x-2 rounded-lg border p-3">
                        <input
                          type="checkbox"
                          id={treatment}
                          checked={formData.bodyShape.includes(treatment)}
                          onChange={() => handleCheckboxChange('bodyShape', treatment)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor={treatment} className="flex-1 cursor-pointer">{treatment}</Label>
                      </div>
                    ))}
                  </div>

                  {/* Hair & Anti-Aging */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Hair & Anti-Aging</h3>
                    {[
                      'Hair Transplant / Hair PRP',
                      'Anti-Aging Injection / IV Therapy',
                      'Mesotherapy',
                      'Wellness Detox & Recovery Retreat'
                    ].map((treatment) => (
                      <div key={treatment} className="flex items-center space-x-2 rounded-lg border p-3">
                        <input
                          type="checkbox"
                          id={treatment}
                          checked={formData.hairAntiAging.includes(treatment)}
                          onChange={() => handleCheckboxChange('hairAntiAging', treatment)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor={treatment} className="flex-1 cursor-pointer">{treatment}</Label>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You did not select "Non-Surgical Beauty Treatment" in Step 2.</p>
                  <p className="text-sm mt-2">This section is optional. Click Continue to proceed to the next section.</p>
                  <Button variant="link" onClick={() => setStep(2)} className="mt-2">
                    Go back to select Non-Surgical Beauty Treatment
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Transgender Treatments */}
          {step === 5 && (
            <div className="space-y-6">
              {showTransgenderTreatments ? (
                <>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm text-muted-foreground">
                      All consultations are handled confidentially and professionally. Your privacy and comfort are our top priorities.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      'Facial Feminisation / Masculinisation Surgery',
                      'Breast / Chest Enhancement',
                      'Body Sculpting / Liposuction',
                      'Voice or Adam\'s Apple Surgery',
                      'Hairline / Hair Transplant Treatment',
                      'Hormonal or Skin-Feminising Treatments'
                    ].map((treatment) => (
                      <div key={treatment} className="flex items-center space-x-2 rounded-lg border p-3">
                        <input
                          type="checkbox"
                          id={treatment}
                          checked={formData.transgenderTreatments.includes(treatment)}
                          onChange={() => handleCheckboxChange('transgenderTreatments', treatment)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor={treatment} className="flex-1 cursor-pointer">{treatment}</Label>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You did not select "Gender-Affirming or Transgender Transformation" in Step 2.</p>
                  <p className="text-sm mt-2">This section is optional. Click Continue to proceed to the next section.</p>
                  <Button variant="link" onClick={() => setStep(2)} className="mt-2">
                    Go back to select Gender-Affirming Treatment
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 6: Additional Information */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Have you undergone any cosmetic or medical procedures before? *</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2 rounded-lg border p-3">
                    <RadioGroupItem
                      value="yes"
                      id="prev-yes"
                      name="previousProcedures"
                      checked={formData.previousProcedures}
                      onChange={() => setFormData({ ...formData, previousProcedures: true })}
                      required
                    />
                    <Label htmlFor="prev-yes" className="flex-1 cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-3">
                    <RadioGroupItem
                      value="no"
                      id="prev-no"
                      name="previousProcedures"
                      checked={!formData.previousProcedures}
                      onChange={() => setFormData({ ...formData, previousProcedures: false })}
                      required
                    />
                    <Label htmlFor="prev-no" className="flex-1 cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.previousProcedures && (
                <div className="space-y-2">
                  <Label htmlFor="previousProceduresDetails">Please specify the procedures *</Label>
                  <Textarea
                    id="previousProceduresDetails"
                    value={formData.previousProceduresDetails}
                    onChange={(e) => setFormData({ ...formData, previousProceduresDetails: e.target.value })}
                    placeholder="Describe your previous procedures..."
                    rows={3}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="medicalConditions">Any medical conditions or allergies we should know about?</Label>
                <Textarea
                  id="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                  placeholder="List any medical conditions, allergies, or medications..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredMonth">Preferred Month of Travel / Consultation</Label>
                <Input
                  id="preferredMonth"
                  value={formData.preferredMonth}
                  onChange={(e) => setFormData({ ...formData, preferredMonth: e.target.value })}
                  placeholder="e.g., January 2026"
                />
              </div>

              <div className="space-y-3">
                <Label>Would you like to include sightseeing or relaxation tours?</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2 rounded-lg border p-3">
                    <RadioGroupItem
                      value="yes"
                      id="sight-yes"
                      name="includeSightseeing"
                      checked={formData.includeSightseeing}
                      onChange={() => setFormData({ ...formData, includeSightseeing: true })}
                    />
                    <Label htmlFor="sight-yes" className="flex-1 cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-3">
                    <RadioGroupItem
                      value="no"
                      id="sight-no"
                      name="includeSightseeing"
                      checked={!formData.includeSightseeing}
                      onChange={() => setFormData({ ...formData, includeSightseeing: false })}
                    />
                    <Label htmlFor="sight-no" className="flex-1 cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="p-4 rounded-lg bg-muted border">
                <h4 className="font-semibold mb-2">Declaration</h4>
                <p className="text-sm text-muted-foreground">
                  I confirm that the information provided above is true to the best of my knowledge. 
                  I understand that my details will be used only for treatment planning and will remain strictly confidential.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <div>
              {step > 1 && (
                <Button type="button" variant="outline" onClick={goToPreviousStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={saveDraft}>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              {step < 6 ? (
                <Button type="button" onClick={goToNextStep}>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit}>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Form
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreatmentFormPage;

