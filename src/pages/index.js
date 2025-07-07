// src/pages/index.js

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';
import quotes from '../data/quotes.json';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';

export default function Home() {
  const router = useRouter();
  const initialTopic =
    typeof router.query.topic === 'string' ? router.query.topic : '';

  const [topic, setTopic] = useState(initialTopic);
  const [results, setResults] = useState([]);

  const topics = useMemo(
    () => Array.from(new Set(quotes.map(q => q.topic))).sort(),
    []
  );

  // Auto-run on load if ?topic=
  useEffect(() => {
    if (initialTopic) {
      const matched = quotes
        .filter(q =>
          q.topic.toLowerCase().includes(initialTopic.toLowerCase())
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      setResults(matched);
    }
  }, [initialTopic]);

  function handleSubmit(e) {
    e.preventDefault();

    const matched = quotes
      .filter(q =>
        q.topic.toLowerCase().includes(topic.trim().toLowerCase())
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    setResults(matched);

    router.push(
      { pathname: '/', query: { topic: topic.trim().toLowerCase() } },
      undefined,
      { shallow: true }
    );
  }

  return (
    <>
      <Head>
        <title>Classic Quote Generator</title>
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-stone-100 to-stone-300 font-serif flex items-center justify-center p-6">
        <div className="relative bg-stone-200 border-2 border-stone-400 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] rounded-3xl p-8 w-full max-w-lg overflow-hidden">
          {/* curled-corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 bg-stone-300 rounded-br-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-0 right-0 w-16 h-16 bg-stone-300 rounded-bl-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-stone-300 rounded-tr-full -translate-x-1/2 translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-stone-300 rounded-tl-full translate-x-1/2 translate-y-1/2" />

          <h1 className="text-4xl font-bold text-stone-800 text-center mb-6">
            🪶 Classic Quotes 🪶
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Input
                list="topic-list"
                placeholder="Select a topic…"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full bg-stone-300 text-stone-900 placeholder-stone-600"
              />
              <datalist id="topic-list">
                {topics.map(t => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </div>
            <Button
              type="submit"
              className="bg-stone-800 hover:bg-stone-900 text-stone-50"
            >
              Reveal
            </Button>
          </form>

          <div className="space-y-6">
            {results.length > 0 ? (
              results.map((q, i) => (
                <motion.div
                  key={i}
                  className="quote-card"               /* ← for print page-break */
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="rounded-lg border border-stone-400 bg-stone-200 shadow-md">
                    <CardContent className="quote-text text-stone-900 text-lg italic">
                      “{q.text}”
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              topic && (
                <p className="quote-card quote-text text-center text-stone-800 italic">
                  No quotes found for “{topic}.”
                </p>
              )
            )}
          </div>
        </div>
      </main>
    </>
  );
}
