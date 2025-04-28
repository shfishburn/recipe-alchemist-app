import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/ui/navbar';
import { useScrollRestoration } from '@/hooks/use-scroll-restoration';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { Link } from 'react-router-dom';

const About = () => {
  // Use our scroll restoration hook
  useScrollRestoration();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>About Recipe Alchemy | Our Story, Mission & Values</title>
        <meta name="description" content="Recipe Alchemy was founded by a team who loves great food, respects real science, and believes technology should make life in the kitchen richer. Learn about our mission, team, and values." />
      </Helmet>
      <Navbar />
      <main className="flex-1 animate-fadeIn">
        <div className="container-page py-6 md:py-8 flex-grow">
          {/* Breadcrumb Navigation */}
          <nav className="mb-4" aria-label="Breadcrumb">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>About</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold mb-4">About Recipe Alchemy</h1>
          <p className="text-base text-muted-foreground mb-8">
            Learn about our story, our mission, and the team behind Recipe Alchemy's innovative approach to personalized cooking and nutrition.
          </p>

          {/* Who We Are */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl font-bold mb-6">Who We Are</h2>
            <div className="prose max-w-none text-lg">
              <p className="mb-4">
                Recipe Alchemy was founded in Seattle by a small team of humans who love great food, respect real science, and believe technology should make life in the kitchen richer — not more complicated.
              </p>
              <p className="mb-4">
                We didn't set out to replace the cook. We set out to empower the cook — blending culinary wisdom, nutritional science, and modern AI into a tool that helps you create smarter, healthier, more satisfying meals.
              </p>
              <p className="mb-4">
                Our team spans across Seattle and Brazil, bringing together diverse cultural perspectives, culinary traditions, and global innovation spirit. We believe great ideas are born when different ways of thinking about food, health, and technology collide — and we built Recipe Alchemy to reflect that richness.
              </p>
              <p className="mb-4">
                We are chefs, developers, dietitians, and makers — building systems that respect where ingredients come from, how flavors evolve, and how your body needs to be nourished.
              </p>
              <p className="mb-4">
                And yes, AI helped. But humans led — every decision, every recipe framework, every nuance of how flavors, textures, and nutrition come together.
              </p>
            </div>
          </section>

          {/* Why We Built Recipe Alchemy */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl font-bold mb-6">Why We Built Recipe Alchemy</h2>
            <div className="prose max-w-none text-lg">
              <p className="mb-4">
                Because real life in the kitchen is messy, joyful, dynamic — and a little unpredictable. And because great cooking isn't just about following steps — it's about understanding ingredients, feeling confident to adapt, and being able to trust that what you create will nourish you deeply.
              </p>
              <p className="mb-4">We built Recipe Alchemy to offer:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Accurate, real-world nutrition analysis — based on lab-tested sources and real cooking transformations.</li>
                <li>Smart ingredient substitution — so you can swap, adjust, and personalize without losing flavor or structure.</li>
                <li>Personalized recipes — aligned with your energy needs, goals, and tastes, not someone else's one-size-fits-all plan.</li>
                <li>An intelligent assistant — who helps you tweak recipes on the fly, answer questions, and learn along the way.</li>
              </ul>
              <p className="mb-4">
                Because cooking isn't static. And neither are you.
              </p>
            </div>
          </section>

          {/* How We Work */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl font-bold mb-6">How We Work</h2>
            <div className="prose max-w-none text-lg">
              <p className="mb-4">Our system is powered by real science:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Trusted data from USDA FoodData Central and branded food databases.</li>
                <li>Cooking yield and nutrient retention adjustments based on peer-reviewed research.</li>
                <li>Personalized nutrition calculations rooted in scientific metabolic models.</li>
                <li>Culinary principles that honor flavor chemistry, regional authenticity, and the art of cooking by hand.</li>
              </ul>
              <p className="mb-4">
                Our AI was trained to assist — not to take over. Humans bring the curiosity, creativity, and common sense. AI brings speed, precision, and a tireless willingness to calculate and recalibrate.
              </p>
              <p className="mb-4">
                Together, they create a better kitchen experience — one recipe, one meal, one joyful moment at a time.
              </p>
            </div>
          </section>

          {/* Our Mission */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
            <div className="prose max-w-none text-lg">
              <p className="mb-4">
                To fundamentally transform the way humanity cooks — making every meal an intelligent act of self-optimization, joy, and health.
              </p>
              <p className="mb-4">
                We are building a future where food isn't accidental — where every home-cooked meal becomes a seamless fusion of flavor, science, and personal health intelligence.
              </p>
              <p className="mb-6 font-semibold">Our Big Hairy Audacious Goal:</p>
              <p className="mb-4 italic">
                To engineer a global shift: 1 billion meals per year intelligently personalized to optimize human health, resilience, and vitality.
              </p>
              <p className="mb-4">In this future:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Food is no longer guesswork.</li>
                <li>Nutrition is no longer reactive.</li>
                <li>Flavor and well-being walk hand-in-hand, every time you eat.</li>
              </ul>
              <p className="mb-4">
                We're not just helping people cook better. We are reprogramming the global relationship between eating and thriving. Powered by AI. Informed by real science. Inspired by the art of living well.
              </p>
              <p className="mb-4">
                Recipe Alchemy brings together perspectives from Seattle's innovation ecosystem and Brazil's rich culinary heritage — blending scientific rigor with global creativity.
              </p>
              <p className="mb-4">
                This is Recipe Alchemy. And this is just the beginning.
              </p>
            </div>
          </section>

          {/* Made With Care */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl font-bold mb-6">Made With Care Across Continents</h2>
            <div className="prose max-w-none text-lg">
              <p className="mb-4">
                Seattle and Brazil are woven into the DNA of Recipe Alchemy: From the bustling farmers markets of Pike Place to the bold flavors of Bahia and São Paulo, we bring together different traditions, ideas, and visions for what food — and life — can be.
              </p>
              <p className="mb-4">
                This diversity isn't just about geography. It's about mindset: Innovation grounded in science. Joy rooted in culture. Cooking elevated by intelligence.
              </p>
            </div>
          </section>

          {/* Closing */}
          <section className="mb-8 md:mb-12">
            <div className="prose max-w-none text-lg">
              <p className="text-xl font-semibold mb-2">Real Humans. Real Science. Smarter Cooking.</p>
              <p className="mb-4">Welcome to Recipe Alchemy.</p>
              <p>Let's create something extraordinary, together.</p>
            </div>
          </section>
        </div>
      </main>
      {/* Footer is included from App.tsx */}
    </div>
  );
};

export default About;
