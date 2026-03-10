# Anantya Foundation - Volunteer Onboarding Application

A modern, responsive onboarding form application for volunteer registration built with React, Vite, TailwindCSS, and Supabase.

## Features

- Clean, minimal UI design
- Mobile-responsive layout
- Image upload to Cloudinary
- Form validation with React Hook Form
- Email notifications via Supabase Edge Functions
- Integration with external onboarding API

## Tech Stack

- **Frontend Framework**: React 18 with Vite
- **Styling**: TailwindCSS
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Image Upload**: Cloudinary
- **Email Service**: Resend (via Supabase Edge Functions)
- **Icons**: Lucide React

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Cloudinary account
- (Optional) Supabase account for email notifications
- (Optional) Resend API key for sending emails

## Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Cloudinary Setup

1. Create a free account at [Cloudinary](https://cloudinary.com)

2. Go to your Cloudinary Dashboard

3. Note your **Cloud Name** (visible on the dashboard)

4. Create an **Upload Preset**:
   - Go to Settings > Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Set the signing mode to "Unsigned"
   - Copy the preset name

5. Add these values to your `.env` file:
   ```
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_preset_name
   ```

## Email Notification Setup (Optional)

The application uses Supabase Edge Functions to send confirmation emails via Resend.

### If you have Supabase configured:

1. The Edge Function is already deployed

2. To enable email sending, you need a Resend API key:
   - Sign up at [Resend](https://resend.com)
   - Get your API key from the dashboard
   - Add it as a secret to your Supabase project

3. The application will work without email configuration, but users won't receive confirmation emails

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Form Fields

The onboarding form includes the following fields:

- **Full Name** (required)
- **Email** (required, validated)
- **Phone Number** (required, 10 digits)
- **Date of Birth** (required)
- **Age** (required, 18-100)
- **Gender** (required: Male, Female, Other)
- **Location** (required)
- **Profession** (required)
- **Place of Profession** (required)
- **Department** (required, multi-select: Tech, Management, Operations, Design, Marketing)
- **Volunteered Before** (required: Yes/No)
- **Government ID Picture** (required, image upload)
- **Member Picture** (required, image upload)
- **Acknowledgement** (required checkbox)
- **Can Attend Events** (optional checkbox)

## API Integration

The form submits data to: `https://anantya-api.onrender.com/onboard`

### Request Format

```json
{
  "email": "user@example.com",
  "fullname": "John Doe",
  "age": 22,
  "gender": "Male",
  "location": "Delhi",
  "phone_number": "9876543210",
  "profession": "Student",
  "place_of_profession": "ABC College",
  "department": ["Tech"],
  "volunteered_before": "No",
  "acknowledgement": true,
  "can_attend_events": true,
  "government_id_picture": "https://cloudinary.com/...",
  "member_picture": "https://cloudinary.com/...",
  "dob": "2002-05-12"
}
```

## Project Structure

```
project/
├── src/
│   ├── components/
│   │   └── OnboardingForm.tsx
│   ├── services/
│   │   └── api.ts
│   ├── utils/
│   │   └── cloudinary.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   └── functions/
│       └── send-confirmation-email/
│           └── index.ts
├── .env.example
└── package.json
```

## Development Notes

### Image Upload Flow

1. User selects an image file
2. Preview is shown immediately
3. On form submission, images are uploaded to Cloudinary
4. Cloudinary URLs are included in the API request

### Email Notification Flow

1. Form is submitted to the main API
2. If successful, a request is sent to the Supabase Edge Function
3. The Edge Function sends a confirmation email via Resend
4. If email service is not configured, the registration still succeeds

## Troubleshooting

### Cloudinary Upload Fails

- Verify your Cloud Name and Upload Preset are correct
- Ensure the upload preset is set to "Unsigned" mode
- Check browser console for detailed error messages

### Form Validation Errors

- All required fields must be filled
- Email must be in valid format
- Phone number must be exactly 10 digits
- Age must be between 18-100
- At least one department must be selected
- Both images must be uploaded

### Email Not Sending

- Emails are optional - registration will still succeed
- Check if RESEND_API_KEY is configured in Supabase
- Verify Supabase URL and Anon Key are correct
- Check browser console for API errors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
