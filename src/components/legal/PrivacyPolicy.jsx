import { Helmet } from 'react-helmet';

export default function PrivacyPolicy() {
  return (
    <div className="px-4 py-8 flex justify-center sm:px-6 sm:py-12">
      <Helmet>
        <title>Privacy Policy</title>
        <meta name="description" content="Privacy policy for TinyShare." />
      </Helmet>

      <div className="max-w-3xl w-full p-6 sm:p-10 rounded-xl space-y-6 sm:space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold border-b pb-2 sm:pb-3">
          Privacy Policy
        </h1>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
            1. Controller
          </h2>
          <p className="leading-6 sm:leading-7 text-sm sm:text-base">
            Anton Harbers
            <br />
            SERVICE ADDRESS HERE
            <br />
            Email:{' '}
            <a
              className="text-accent hover:underline"
              href="mailto:tinyshare@gmail.com"
            >
              tinyshare@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
            2. Data We Collect
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
            <li>Email address</li>
            <li>Hashed password</li>
            <li>Login & logout timestamps</li>
            <li>User-generated content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
            3. Purpose of Processing
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
            <li>Account creation & authentication</li>
            <li>Storing user-created content</li>
            <li>Technical safety & error tracking</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
            4. Legal Basis
          </h2>
          <p className="text-sm sm:text-base">
            Art. 6(1)(b) GDPR – Contract performance
          </p>
          <p className="text-sm sm:text-base">
            Art. 6(1)(f) GDPR – Legitimate interests (security + logs)
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
            5. Third-Party Services
          </h2>
          <p className="text-sm sm:text-base">
            Netlify (Hosting)
            <br />
            Supabase (Auth & Database, EU region)
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
            6. Cookies
          </h2>
          <p className="text-sm sm:text-base">
            Only essential session cookies. No tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
            7. Data Sharing
          </h2>
          <p className="text-sm sm:text-base">
            No data shared except with Netlify and Supabase as processors.
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
            8. Data Retention
          </h2>
          <p className="text-sm sm:text-base">
            Data is retained until the user deletes their account.
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
            9. User Rights
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
            <li>Access</li>
            <li>Correction</li>
            <li>Deletion</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section>
          <p className="text-xs sm:text-sm">
            Contact:{' '}
            <a
              className="text-accent hover:underline"
              href="mailto:tinyshare@gmail.com"
            >
              tinyshare@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
            10. Changes
          </h2>
          <p className="text-sm sm:text-base">
            This policy may be updated when necessary.
          </p>
        </section>
      </div>
    </div>
  );
}
