import axios from 'axios';

export interface OnboardingData {
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
  government_id_picture: string;
  member_picture: string;
  dob: string;
}

const ONBOARDING_API = 'https://anantya-api.onrender.com/onboard';

export const submitOnboarding = async (data: OnboardingData) => {
  try {
    const response = await axios.post(ONBOARDING_API, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting onboarding:', error);
    throw error;
  }
};

export const sendConfirmationEmail = async (email: string, fullname: string) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase configuration missing, skipping email notification');
    return;
  }

  try {
    const response = await axios.post(
      `${supabaseUrl}/functions/v1/send-confirmation-email`,
      { email, fullname },
      {
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};
