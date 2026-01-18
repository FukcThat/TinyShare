import { Helmet } from 'react-helmet';

export default function Impressum() {
  return (
    <div className="px-4 py-8 flex justify-center sm:px-6 sm:py-12">
      <Helmet>
        <title>Imprint</title>
        <meta name="description" content="Legal imprint for TinyShare." />
      </Helmet>

      <div className="max-w-3xl w-full p-6 sm:p-10 rounded-xl space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold border-b pb-2 sm:pb-3">
          Imprint
        </h1>

        <p className="font-semibold text-sm sm:text-base">
          Required according to § 5 TMG
        </p>

        <p className="text-sm sm:text-base">
          Anton Harbers
          <br />
          SERVICE ADDRESS HERE
        </p>

        <p className="text-sm sm:text-base">
          <strong>Contact</strong>
          <br />
          Email:{' '}
          <a
            className="text-accent hover:underline"
            href="mailto:tinyshare@gmail.com"
          >
            tinyshare@gmail.com
          </a>
        </p>

        <p className="text-sm sm:text-base">
          <strong>Responsible for content (§ 55 Abs. 2 RStV):</strong>
          <br />
          Anton Harbers
        </p>
      </div>
    </div>
  );
}
