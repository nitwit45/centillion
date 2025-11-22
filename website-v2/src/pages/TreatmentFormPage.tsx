import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, ArrowRight, ArrowLeft, Save, Send, AlertCircle } from 'lucide-react';

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
  const { user, getTreatmentForm, saveTreatmentForm, submitTreatmentForm, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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
    // Load saved form data from backend
    const loadFormData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const result = await getTreatmentForm();
          if (result.success && result.data) {
            setFormData(result.data);
          }
        } catch (error) {
          console.error('Error loading form data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadFormData();
  }, [user, getTreatmentForm]);

  // Refresh user data when success screen is shown (step 7)
  useEffect(() => {
    if (step === 7) {
      refreshUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]); // Only run when step changes

  const saveDraft = async () => {
    if (user) {
      setIsLoading(true);
      try {
        const result = await saveTreatmentForm(formData);
        if (result.success) {
          alert('Draft saved successfully!');
        } else {
          alert(`Error saving draft: ${result.error}`);
        }
      } catch (error) {
        console.error('Error saving draft:', error);
        alert('Error saving draft. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCheckboxChange = (category: keyof TreatmentFormData, value: string) => {
    const currentArray = formData[category] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setFormData({ ...formData, [category]: newArray });
  };

  const checkRequiredDocuments = () => {
    if (!user) return false;

    const savedDocs = localStorage.getItem(`documents_${user.id}`);
    if (!savedDocs) return false;

    const documents = JSON.parse(savedDocs);
    const requiredCategories = ['consent_form', 'medical_history', 'id_proof'];

    return requiredCategories.every(category =>
      documents.some((doc: any) => doc.category === category)
    );
  };

  const handleSubmit = async () => {
    // Check if required documents are uploaded
    if (!checkRequiredDocuments()) {
      alert('Please upload all required documents (Consent Form, Medical History, and ID Proof) before submitting the form.');
      return;
    }

    if (user) {
      setIsLoading(true);
      try {
        const result = await submitTreatmentForm();
        if (result.success) {
          setStep(7); // Success screen
        } else {
          alert(`Error submitting form: ${result.error}`);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting form. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Dynamic form logic based on selections
  const showSurgicalTreatments = formData.purposeOfVisit.includes('Cosmetic Surgery');
  const showNonSurgicalTreatments = formData.purposeOfVisit.includes('Non-Surgical Beauty Treatment');
  const showTransgenderTreatments = formData.purposeOfVisit.includes('Gender-Affirming or Transgender Transformation');
  const showWellnessProgram = formData.purposeOfVisit.includes('Wellness & Detox Program');
  const showAntiAging = formData.purposeOfVisit.includes('Rejuvenation / Anti-Aging Package');

  // Dynamic options based on gender
  const getGenderSpecificOptions = (category: string) => {
    if (category === 'breastChest') {
      if (formData.gender === 'Male' || formData.gender === 'Transgender') {
        return [
          'Breast Augmentation',
          'Male Chest Sculpting / Gynecomastia Surgery'
        ];
      } else if (formData.gender === 'Female') {
        return [
          'Breast Augmentation',
          'Breast Lift / Firming',
          'Breast Reduction'
        ];
      }
    }
    return null; // Return null to use default options
  };

  // Dynamic step calculation
  const getDynamicSteps = () => {
    const steps = [1, 2]; // Personal info and purpose are always required

    if (showSurgicalTreatments) steps.push(3);
    if (showNonSurgicalTreatments) steps.push(4);
    if (showTransgenderTreatments) steps.push(5);
    if (showWellnessProgram || showAntiAging) steps.push(6); // Additional services step

    steps.push(7); // Final step with additional info is always last
    return steps;
  };

  const dynamicSteps = getDynamicSteps();
  const totalSteps = Math.max(...dynamicSteps);
  const progress = (step / totalSteps) * 100;

  // Navigate to next dynamic step
  const goToNextStep = () => {
    const currentIndex = dynamicSteps.indexOf(step);
    if (currentIndex < dynamicSteps.length - 1) {
      setStep(dynamicSteps[currentIndex + 1]);
    }
  };

  // Navigate to previous dynamic step
  const goToPreviousStep = () => {
    const currentIndex = dynamicSteps.indexOf(step);
    if (currentIndex > 0) {
      setStep(dynamicSteps[currentIndex - 1]);
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
              Status: {(user?.beautyFormStatus === 'submitted' || step === 7) ? 'SUBMITTED' : user?.beautyFormStatus?.replace('_', ' ').toUpperCase()}
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

  if (isLoading && !formData.dateOfBirth) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your form...</p>
          </div>
        </div>
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
            {step === 6 && (showWellnessProgram || showAntiAging) ? 'Wellness & Anti-Aging Services' : 'Additional Information & Preferences'}
            {step === 7 && (showWellnessProgram || showAntiAging) && 'Additional Information & Preferences'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Tell us about yourself'}
            {step === 2 && 'Select all that apply to your visit'}
            {step === 3 && 'Select the surgical procedures you are interested in'}
            {step === 4 && 'Select the non-surgical treatments you would like'}
            {step === 5 && 'Confidential and professional consultation'}
            {step === 6 && (showWellnessProgram || showAntiAging) ? 'Enhance your experience with additional services' : 'Final details to complete your request'}
            {step === 7 && (showWellnessProgram || showAntiAging) && 'Final details to complete your request'}
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
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Please select all that apply to your visit *</Label>
                {[
                  {
                    value: 'Cosmetic Surgery',
                    description: 'Surgical procedures for facial and body enhancement',
                    recommended: formData.gender === 'Female' || formData.gender === 'Male'
                  },
                  {
                    value: 'Non-Surgical Beauty Treatment',
                    description: 'Injectables, fillers, laser treatments, and skin care',
                    recommended: true
                  },
                  {
                    value: 'Wellness & Detox Program',
                    description: 'Holistic wellness, detox retreats, and recovery programs',
                    recommended: formData.purposeOfVisit.includes('Rejuvenation / Anti-Aging Package')
                  },
                  {
                    value: 'Gender-Affirming or Transgender Transformation',
                    description: 'Specialized procedures for gender affirmation',
                    recommended: formData.gender === 'Transgender' || formData.gender === 'Prefer not to say'
                  },
                  {
                    value: 'Rejuvenation / Anti-Aging Package',
                    description: 'Comprehensive anti-aging treatments and packages',
                    recommended: true
                  }
                ].map((option) => (
                  <div key={option.value} className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                    <input
                      type="checkbox"
                      id={option.value}
                      checked={formData.purposeOfVisit.includes(option.value)}
                      onChange={() => handleCheckboxChange('purposeOfVisit', option.value)}
                      className="h-4 w-4 rounded border-gray-300 mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={option.value} className="flex items-center gap-2 cursor-pointer font-medium">
                        {option.value}
                        {option.recommended && (
                          <Badge variant="secondary" className="text-xs">Recommended</Badge>
                        )}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic recommendations based on previous answers */}
              {formData.gender === 'Transgender' && !formData.purposeOfVisit.includes('Gender-Affirming or Transgender Transformation') && (
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900 dark:text-blue-100">
                      <p className="font-semibold mb-1">Gender-Affirming Care</p>
                      <p className="mb-2">
                        Based on your gender selection, you may be interested in our specialized gender-affirming treatments.
                        These can be discussed confidentially with our medical team.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCheckboxChange('purposeOfVisit', 'Gender-Affirming or Transgender Transformation')}
                        className="text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700"
                      >
                        Add Gender-Affirming Care
                      </Button>
                    </div>
                  </div>
                </div>
              )}
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
                    {(getGenderSpecificOptions('breastChest') || [
                      'Breast Augmentation',
                      'Breast Lift / Firming',
                      'Breast Reduction',
                      'Male Chest Sculpting / Gynecomastia Surgery'
                    ]).map((treatment) => (
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

          {/* Step 6: Wellness & Anti-Aging Services */}
          {step === 6 && (showWellnessProgram || showAntiAging) && (
            <div className="space-y-6">
              {showWellnessProgram && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Wellness & Detox Programs</h3>
                  <p className="text-sm text-muted-foreground">
                    Enhance your beauty treatment with holistic wellness services.
                  </p>
                  {[
                    'Nutritional Consultation & Meal Planning',
                    'Ayurvedic Treatments & Therapies',
                    'Meditation & Mindfulness Sessions',
                    'Yoga & Fitness Classes',
                    'Spa & Massage Treatments',
                    'Detox Programs & Cleanse Retreats'
                  ].map((service) => (
                    <div key={service} className="flex items-center space-x-2 rounded-lg border p-3">
                      <input
                        type="checkbox"
                        id={service}
                        checked={formData.hairAntiAging.includes(service)}
                        onChange={() => handleCheckboxChange('hairAntiAging', service)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor={service} className="flex-1 cursor-pointer">{service}</Label>
                    </div>
                  ))}
                </div>
              )}

              {showAntiAging && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Anti-Aging & Rejuvenation Packages</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive anti-aging treatments to maintain your youthful appearance.
                  </p>
                  {[
                    'Stem Cell Therapy',
                    'Hormone Replacement Therapy',
                    'IV Vitamin Therapy',
                    'Bioidentical Hormone Treatments',
                    'Anti-Aging Skincare Regimen',
                    'Preventive Health Screenings'
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
              )}
            </div>
          )}

          {/* Step 6/7: Additional Information */}
          {((step === 6 && !showWellnessProgram && !showAntiAging) || (step === 7 && (showWellnessProgram || showAntiAging))) && (
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

              {!checkRequiredDocuments() && (
                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-900 dark:text-yellow-100">
                      <p className="font-semibold mb-1">Required Documents Missing</p>
                      <p className="mb-2">
                        Please upload all required documents before submitting your treatment form:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-300">
                        <li>Consent Form</li>
                        <li>Medical History</li>
                        <li>ID Proof</li>
                      </ul>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => window.location.href = '/dashboard/documents'}
                      >
                        Go to Documents
                      </Button>
                    </div>
                  </div>
                </div>
              )}
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
              <Button type="button" variant="outline" onClick={saveDraft} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Draft'}
              </Button>
              {step < dynamicSteps[dynamicSteps.length - 1] ? (
                <Button type="button" onClick={goToNextStep} disabled={isLoading}>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} disabled={isLoading}>
                  <Send className="mr-2 h-4 w-4" />
                  {isLoading ? 'Submitting...' : 'Submit Form'}
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

