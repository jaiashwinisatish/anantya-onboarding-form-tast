import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Loader2, CheckCircle } from 'lucide-react';
import { uploadToCloudinary } from '../utils/cloudinary';
import { submitOnboarding, sendConfirmationEmail, OnboardingData } from '../services/api';

interface FormData {
  email: string;
  fullname: string;
  age: number;
  gender: string;
  location: string;
  phone_number: string;
  profession: string;
  place_of_profession: string;
  department: string[];
  volunteered_before: string;
  acknowledgement: boolean;
  can_attend_events: boolean;
  government_id_picture: FileList;
  member_picture: FileList;
  dob: string;
}

const OnboardingForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [uploadingGovId, setUploadingGovId] = useState(false);
  const [uploadingMemberPic, setUploadingMemberPic] = useState(false);
  const [govIdPreview, setGovIdPreview] = useState<string | null>(null);
  const [memberPicPreview, setMemberPicPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const departmentOptions = ['Tech', 'Management', 'Operations', 'Design', 'Marketing'];

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      setUploadingGovId(true);
      const govIdUrl = await uploadToCloudinary(data.government_id_picture[0]);
      setUploadingGovId(false);

      setUploadingMemberPic(true);
      const memberPicUrl = await uploadToCloudinary(data.member_picture[0]);
      setUploadingMemberPic(false);

      const onboardingData: OnboardingData = {
        email: data.email,
        fullname: data.fullname,
        age: Number(data.age),
        gender: data.gender,
        location: data.location,
        phone_number: data.phone_number,
        profession: data.profession,
        place_of_profession: data.place_of_profession,
        department: data.department,
        volunteered_before: data.volunteered_before,
        acknowledgement: data.acknowledgement,
        can_attend_events: data.can_attend_events,
        government_id_picture: govIdUrl,
        member_picture: memberPicUrl,
        dob: data.dob,
      };

      await submitOnboarding(onboardingData);

      await sendConfirmationEmail(data.email, data.fullname);

      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError('Failed to submit onboarding. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilePreview = (file: File, setPreview: (url: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Anantya Foundation!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for registering as a volunteer. We've sent a confirmation email to your inbox.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Volunteer Onboarding</h1>
            <p className="text-gray-600">Join Anantya Foundation and make a difference</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('fullname', { required: 'Full name is required' })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="John Doe"
                />
                {errors.fullname && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullname.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register('phone_number', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit phone number',
                    },
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="9876543210"
                />
                {errors.phone_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone_number.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('dob', { required: 'Date of birth is required' })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
                {errors.dob && (
                  <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register('age', {
                    required: 'Age is required',
                    min: { value: 18, message: 'Must be at least 18 years old' },
                    max: { value: 100, message: 'Please enter a valid age' },
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="22"
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('gender', { required: 'Gender is required' })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('location', { required: 'Location is required' })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="Delhi"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profession <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('profession', { required: 'Profession is required' })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="Student"
                />
                {errors.profession && (
                  <p className="mt-1 text-sm text-red-600">{errors.profession.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Place of Profession <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('place_of_profession', {
                    required: 'Place of profession is required',
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="ABC College"
                />
                {errors.place_of_profession && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.place_of_profession.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volunteered Before? <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('volunteered_before', {
                    required: 'This field is required',
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                >
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.volunteered_before && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.volunteered_before.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department <span className="text-red-500">*</span> (Select multiple)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {departmentOptions.map((dept) => (
                  <label
                    key={dept}
                    className="flex items-center space-x-2 p-3 rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={dept}
                      {...register('department', {
                        required: 'Please select at least one department',
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{dept}</span>
                  </label>
                ))}
              </div>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Government ID Picture <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    {...register('government_id_picture', {
                      required: 'Government ID picture is required',
                      onChange: (e) => {
                        if (e.target.files?.[0]) {
                          handleFilePreview(e.target.files[0], setGovIdPreview);
                        }
                      },
                    })}
                    className="hidden"
                    id="gov-id-input"
                  />
                  <label
                    htmlFor="gov-id-input"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    {govIdPreview ? (
                      <img
                        src={govIdPreview}
                        alt="Government ID Preview"
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload</span>
                      </>
                    )}
                  </label>
                </div>
                {errors.government_id_picture && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.government_id_picture.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Picture <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    {...register('member_picture', {
                      required: 'Member picture is required',
                      onChange: (e) => {
                        if (e.target.files?.[0]) {
                          handleFilePreview(e.target.files[0], setMemberPicPreview);
                        }
                      },
                    })}
                    className="hidden"
                    id="member-pic-input"
                  />
                  <label
                    htmlFor="member-pic-input"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    {memberPicPreview ? (
                      <img
                        src={memberPicPreview}
                        alt="Member Picture Preview"
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload</span>
                      </>
                    )}
                  </label>
                </div>
                {errors.member_picture && (
                  <p className="mt-1 text-sm text-red-600">{errors.member_picture.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('acknowledgement', {
                    required: 'Please acknowledge this statement',
                  })}
                  className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  I acknowledge that all the information provided is accurate and I am committed to
                  volunteering with Anantya Foundation <span className="text-red-500">*</span>
                </span>
              </label>
              {errors.acknowledgement && (
                <p className="text-sm text-red-600">{errors.acknowledgement.message}</p>
              )}

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('can_attend_events')}
                  className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  I can attend events and activities organized by the foundation
                </span>
              </label>
            </div>

            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  {uploadingGovId
                    ? 'Uploading Government ID...'
                    : uploadingMemberPic
                    ? 'Uploading Member Picture...'
                    : 'Submitting...'}
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
