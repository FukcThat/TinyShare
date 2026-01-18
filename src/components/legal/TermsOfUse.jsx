import { Helmet } from 'react-helmet';

export default function TermsOfUse() {
  return (
    <div className="px-4 py-8 flex justify-center sm:px-6 sm:py-12">
      <Helmet>
        <title>Terms of Use</title>
        <meta name="description" content="Terms of use for TinyShare." />
      </Helmet>

      <div className="max-w-3xl w-full p-6 sm:p-10 rounded-xl space-y-6 sm:space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold border-b pb-2 sm:pb-3">
          Terms of Use
        </h1>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
            1. Scope
          </h2>
          <p className="text-sm sm:text-base">
            This platform is provided free of charge. By using it, you agree to
            these terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
            2. User Responsibilities
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
            <li>You may only upload your own content.</li>
            <li>Illegal content is strictly prohibited.</li>
            <li>We may suspend or delete accounts at any time.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
            3. Availability
          </h2>
          <p className="text-sm sm:text-base">
            No guarantee of uptime or error-free operation. Service may be shut
            down anytime.
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
            4. Liability
          </h2>
          <p className="text-sm sm:text-base">
            We are not liable for data loss, outages, or damages from using the
            platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
            5. Changes
          </h2>
          <p className="text-sm sm:text-base">
            Terms may be updated. Continued use means acceptance.
          </p>
        </section>
      </div>
    </div>
  );
}
