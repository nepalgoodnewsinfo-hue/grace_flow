import { Button } from "@/components/ui/button";
import { VisitorForm } from "@/components/visitor-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Grace Flow Church</h1>
            <ul className="hidden md:flex gap-6">
              <li><a href="#home" className="hover:text-blue-200">Home</a></li>
              <li><a href="#welcome" className="hover:text-blue-200">About</a></li>
              <li><a href="#visit" className="hover:text-blue-200">Visit</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Welcome to Grace Flow
          </h2>
          <p className="text-lg sm:text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            A community dedicated to faith, fellowship, and spiritual growth. Join us as we worship together and grow in our relationship with God.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-lg">
              Learn More
            </Button>
            <Button className="bg-blue-800 text-white hover:bg-blue-900 font-semibold px-8 py-3 rounded-lg border border-white">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section id="welcome" className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Welcome to Our Church
            </h3>
            <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl text-blue-600 mb-4">✨</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Inspiring Worship</h4>
              <p className="text-gray-600">
                Experience uplifting worship services that connect you with faith and community every Sunday morning.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl text-blue-600 mb-4">🤝</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Fellowship</h4>
              <p className="text-gray-600">
                Build meaningful relationships with like-minded individuals in our welcoming church family.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl text-blue-600 mb-4">📖</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Spiritual Growth</h4>
              <p className="text-gray-600">
                Grow in your faith through Bible studies, prayer groups, and spiritual education programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Your Visit Section */}
      <section id="visit" className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Plan Your Visit
            </h3>
            <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Service Times */}
            <div className="bg-blue-50 p-8 rounded-lg">
              <h4 className="text-2xl font-bold text-blue-600 mb-6">Service Times</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">Sunday Morning Worship</p>
                    <p className="text-gray-600">9:00 AM & 11:00 AM</p>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">Wednesday Evening</p>
                    <p className="text-gray-600">7:00 PM - Bible Study</p>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">Friday Youth Group</p>
                    <p className="text-gray-600">6:30 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Contact */}
            <div className="bg-blue-50 p-8 rounded-lg">
              <h4 className="text-2xl font-bold text-blue-600 mb-6">Location & Contact</h4>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900">Address</p>
                  <p className="text-gray-600">123 Faith Street<br/>Grace City, ST 12345</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Phone</p>
                  <p className="text-gray-600">(555) 123-4567</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600">info@graceflow.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Button className="bg-blue-600 text-white hover:bg-blue-700 font-semibold px-10 py-3 rounded-lg">
              Get Directions
            </Button>
          </div>
        </div>
      </section>

      {/* Visitor Registration Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Plan Your First Visit
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-4">
              We'd love to meet you! Fill out this form to let us know you're coming.
            </p>
            <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="flex justify-center">
            <VisitorForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 Grace Flow Church. All rights reserved.</p>
        </div>
      </footer>
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
