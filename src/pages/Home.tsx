import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Code,
  Database,
  Globe,
  MessageSquare,
  Smartphone,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth, db } from "../services/firebase";

import { useState, useEffect } from "react";

type ReactionType = "like" | "dislike";
type FeedbackComment = {
  id: string;
  message: string;
  authorLabel?: string;
  userId?: string;
  createdAt?: {
    seconds?: number;
  };
};

const reactionsRef = doc(db, "pageReactions", "home");
const commentsRef = collection(db, "pageReactions", "home", "comments");

const Home = () => {
  const skills = [
    {
      icon: Code,
      title: "Frontend Development",
      description: "React, TypeScript, Next.js, Tailwind CSS",
    },
    {
      icon: Database,
      title: "Backend Development",
      description: "Laravel, MySQL, Firebase Firestore",
    },
    {
      icon: Globe,
      title: "Full Stack",
      description: "React, Laravel, MySQL, AWS, Hostinger",
    },
    {
      icon: Smartphone,
      title: "Mobile Development",
      description: "React Native, Flutter",
    },
  ];
  const text = "Hi, I'm Jhonel G. Mira";
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [selectedReaction, setSelectedReaction] = useState<ReactionType | null>(
    null
  );
  const [isReactionLoading, setIsReactionLoading] = useState(true);
  const [isSubmittingReaction, setIsSubmittingReaction] = useState(false);
  const [reactionError, setReactionError] = useState("");
  const [reactionUserId, setReactionUserId] = useState<string | null>(null);
  const [activeReactionAnimation, setActiveReactionAnimation] =
    useState<ReactionType | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<FeedbackComment[]>([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState("");

  const getReactionErrorMessage = (error: unknown) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error
    ) {
      if (error.code === "auth/admin-restricted-operation") {
        return "Enable Anonymous sign-in in Firebase Authentication to use voting.";
      }

      if (error.code === "auth/configuration-not-found") {
        return "Firebase Anonymous Auth is not enabled. Turn it on in Firebase Console > Authentication > Sign-in method > Anonymous.";
      }
    }

    return "Unable to load reactions right now.";
  };

  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseEnd = 2000; // Pause at end before deleting
    const pauseStart = 500; // Pause at start before retyping
  
    if (!isDeleting && index < text.length) {
      // Typing forward
      const timeout = setTimeout(() => {
        setDisplayed((prev) => prev + text[index]);
        setIndex(index + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && index === text.length) {
      // Finished typing, show emoji and pause before deleting
      setShowEmoji(true);
      const timeout = setTimeout(() => {
        setIsDeleting(true);
        setShowEmoji(false);
      }, pauseEnd);
      return () => clearTimeout(timeout);
    } else if (isDeleting && index > 0) {
      // Deleting
      const timeout = setTimeout(() => {
        setDisplayed((prev) => prev.slice(0, -1));
        setIndex(index - 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else if (isDeleting && index === 0) {
      // Finished deleting, pause before retyping
      const timeout = setTimeout(() => {
        setIsDeleting(false);
      }, pauseStart);
      return () => clearTimeout(timeout);
    }
  }, [index, isDeleting, text]);

  useEffect(() => {
    let unsubscribeReactions: (() => void) | undefined;
    let unsubscribeComments: (() => void) | undefined;

    const loadReactions = async (uid: string) => {
      try {
        unsubscribeReactions = onSnapshot(reactionsRef, (snapshot) => {
          if (!snapshot.exists()) {
            setLikes(0);
            setDislikes(0);
            return;
          }

          const data = snapshot.data();
          setLikes(typeof data.likes === "number" ? data.likes : 0);
          setDislikes(typeof data.dislikes === "number" ? data.dislikes : 0);
        });

        unsubscribeComments = onSnapshot(
          query(commentsRef, orderBy("createdAt", "desc")),
          (snapshot) => {
            setComments(
              snapshot.docs.map((commentDoc) => ({
                id: commentDoc.id,
                ...(commentDoc.data() as Omit<FeedbackComment, "id">),
              }))
            );
          }
        );

        const voteSnapshot = await getDoc(
          doc(db, "pageReactions", "home", "votes", uid)
        );

        if (voteSnapshot.exists()) {
          const voteData = voteSnapshot.data();
          if (voteData.reaction === "like" || voteData.reaction === "dislike") {
            setSelectedReaction(voteData.reaction);
          }
        }
      } catch (error) {
        console.error("Error loading reactions:", error);
        setReactionError(getReactionErrorMessage(error));
      } finally {
        setIsReactionLoading(false);
      }
    };

    const initializeReactionVoting = async (user: typeof auth.currentUser) => {
      try {
        const currentUser = user ?? (await signInAnonymously(auth)).user;
        setReactionUserId(currentUser.uid);
        await loadReactions(currentUser.uid);
      } catch (error) {
        console.error("Error initializing anonymous auth:", error);
        setReactionError(getReactionErrorMessage(error));
        setIsReactionLoading(false);
      }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      await initializeReactionVoting(user);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeReactions?.();
      unsubscribeComments?.();
    };
  }, []);

  const handleReaction = async (type: ReactionType) => {
    if (selectedReaction || isSubmittingReaction || !reactionUserId) {
      return;
    }

    setIsSubmittingReaction(true);
    setReactionError("");

    try {
      const updatedCounts = await runTransaction<
        { likes: number; dislikes: number; reaction: ReactionType }
      >(db, async (transaction) => {
        const voteRef = doc(db, "pageReactions", "home", "votes", reactionUserId);
        const [reactionsSnapshot, voteSnapshot] = await Promise.all([
          transaction.get(reactionsRef),
          transaction.get(voteRef),
        ]);

        if (voteSnapshot.exists()) {
          const data = reactionsSnapshot.data();
          return {
            likes: typeof data?.likes === "number" ? data.likes : 0,
            dislikes: typeof data?.dislikes === "number" ? data.dislikes : 0,
            reaction:
              voteSnapshot.data().reaction === "dislike" ? "dislike" : "like",
          };
        }

        const currentLikes =
          reactionsSnapshot.exists() &&
          typeof reactionsSnapshot.data().likes === "number"
            ? reactionsSnapshot.data().likes
            : 0;
        const currentDislikes =
          reactionsSnapshot.exists() &&
          typeof reactionsSnapshot.data().dislikes === "number"
            ? reactionsSnapshot.data().dislikes
            : 0;

        const nextCounts: {
          likes: number;
          dislikes: number;
          reaction: ReactionType;
        } = {
          likes: type === "like" ? currentLikes + 1 : currentLikes,
          dislikes: type === "dislike" ? currentDislikes + 1 : currentDislikes,
          reaction: type,
        };

        transaction.set(
          reactionsRef,
          {
            ...nextCounts,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
        transaction.set(voteRef, {
          reaction: type,
          createdAt: serverTimestamp(),
        });

        return nextCounts;
      });

      setLikes(updatedCounts.likes);
      setDislikes(updatedCounts.dislikes);
      setSelectedReaction(updatedCounts.reaction);
      setActiveReactionAnimation(type);
      window.setTimeout(() => setActiveReactionAnimation(null), 900);
    } catch (error) {
      console.error("Error saving reaction:", error);
      setReactionError(getReactionErrorMessage(error));
    } finally {
      setIsSubmittingReaction(false);
    }
  };

  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!reactionUserId || !comment.trim()) {
      return;
    }

    setIsSubmittingComment(true);
    setCommentError("");
    setCommentSuccess("");

    try {
      await addDoc(commentsRef, {
        message: comment.trim(),
        userId: reactionUserId,
        createdAt: serverTimestamp(),
      });

      setComment("");
      setCommentSuccess("Comment submitted.");
      window.setTimeout(() => setCommentSuccess(""), 1400);
    } catch (error) {
      console.error("Error saving comment:", error);
      setCommentError("Unable to save your comment right now.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatCommentTimestamp = (seconds?: number) => {
    if (!seconds) {
      return "Just now";
    }

    return new Date(seconds * 1000).toLocaleString();
  };

  const visitorLabelMap = comments.reduce<Record<string, string>>((acc, entry) => {
    if (!entry.userId) {
      return acc;
    }

    if (!acc[entry.userId]) {
      const visitorNumber = Object.keys(acc).length + 1;
      acc[entry.userId] = `Visitor ${String(visitorNumber).padStart(2, "0")}`;
    }

    return acc;
  }, {});

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
<h1 className="text-4xl md:text-6xl font-bold leading-tight text-black dark:text-white">
  {displayed}
  {showEmoji && (
    <span className="inline-block animate-wave">👋</span>
  )}
  <span className="animate-blink">|</span>
</h1>

              <p className="text-xl text-gray-600 dark:text-gray-400">
                Full Stack Developer passionate about creating innovative web
                solutions and turning ideas into reality through clean,
                efficient code.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/projects"
                  className="btn-primary inline-flex items-center justify-center"
                >
                  View My Work
                  <ArrowRight size={20} className="ml-2" />
                </Link>
                <Link
                  to="/contact"
                  className="btn-secondary inline-flex items-center justify-center"
                >
                  Get In Touch
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Profile Image */}
              <div className="relative mb-8 group">
  <div className="w-64 h-64 mx-auto relative transition-transform duration-300 transform group-hover:scale-105">
    <div className="absolute inset-0 bg-gray-700 dark:bg-gray-700 rounded-full p-1 transition-all duration-300 group-hover:rotate-6">
      <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-dark-800 p-1">
        <img
          src="/avatar-placeholder.svg"
          alt="Jhonel G. Mira"
          className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            if (!e.currentTarget.dataset.fallback) {
              e.currentTarget.dataset.fallback = "true";
              e.currentTarget.src = "/avatar-placeholder.svg";
            }
          }}
        />
      </div>
    </div>
  </div>
</div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
  <div className="space-y-4">
    <h3 className="text-2xl font-bold">
      Let's Build Something Amazing
    </h3>
    <p className="text-gray-600 dark:text-gray-300">
      I specialize in creating modern, scalable web applications
      that deliver exceptional user experiences.
    </p>
    {/* <div className="flex items-center space-x-4">
      <div className="flex -space-x-2">
        <div className="w-8 h-8 bg-gray-200 dark:bg-white/20 rounded-full border-2 border-gray-900 dark:border-white"></div>
        <div className="w-8 h-8 bg-gray-200 dark:bg-white/20 rounded-full border-2 border-gray-900 dark:border-white"></div>
        <div className="w-8 h-8 bg-gray-200 dark:bg-white/20 rounded-full border-2 border-gray-900 dark:border-white"></div>
      </div>
      <span className="text-sm">
        Trusted by developers worldwide
      </span>
    </div> */}
  </div>
</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="section-padding bg-gray-50 dark:bg-dark-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What I Do</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              I specialize in full-stack development, creating robust and
              scalable applications that solve real-world problems.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-900/40 transition-colors duration-200">
                  <skill.icon
                    size={32}
                    className="text-primary-600 dark:text-primary-400"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {skill.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {skill.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Let's collaborate to bring your ideas to life. I'm here to help
              you create something extraordinary.
            </p>
            <Link
              to="/contact"
              className="btn-primary inline-flex items-center justify-center text-lg px-8 py-3"
            >
              Let's Talk
              <ArrowRight size={24} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-gray-50 dark:bg-dark-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-7xl rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-xl shadow-gray-200/70 dark:border-gray-700 dark:bg-gray-900 dark:shadow-black/30 dark:text-white"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold">Quick Feedback</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Vote once using an anonymous Firebase account. Each visitor
                  gets a unique UID without needing a manual sign-in.
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {selectedReaction
                    ? "Your anonymous vote has already been recorded."
                    : "Leave a like or dislike for this portfolio."}
                </p>
              </div>
              <div className="flex gap-3 lg:pt-1">
                <motion.button
                  type="button"
                  onClick={() => void handleReaction("like")}
                  disabled={
                    Boolean(selectedReaction) ||
                    isSubmittingReaction ||
                    isReactionLoading ||
                    !reactionUserId
                  }
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                    selectedReaction === "like"
                      ? "border-green-500 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "border-gray-200 bg-white hover:border-green-300 hover:text-green-600 dark:border-gray-700 dark:bg-dark-800 dark:hover:border-green-700 dark:hover:text-green-400"
                  }`}
                  whileTap={{ scale: 0.94 }}
                  animate={
                    activeReactionAnimation === "like"
                      ? {
                          scale: [1, 1.14, 1],
                          boxShadow: [
                            "0 0 0 rgba(34,197,94,0)",
                            "0 0 0 10px rgba(34,197,94,0.18)",
                            "0 0 0 rgba(34,197,94,0)",
                          ],
                        }
                      : undefined
                  }
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <ThumbsUp size={16} />
                  <span className="relative inline-flex items-center">
                    Like {isReactionLoading ? "..." : likes}
                    <AnimatePresence>
                      {activeReactionAnimation === "like" && (
                        <motion.span
                          initial={{ opacity: 0, y: 8, scale: 0.8 }}
                          animate={{ opacity: 1, y: -16, scale: 1 }}
                          exit={{ opacity: 0, y: -28, scale: 0.8 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="pointer-events-none absolute -right-4 -top-3 text-xs font-bold text-green-500"
                        >
                          +1
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => void handleReaction("dislike")}
                  disabled={
                    Boolean(selectedReaction) ||
                    isSubmittingReaction ||
                    isReactionLoading ||
                    !reactionUserId
                  }
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                    selectedReaction === "dislike"
                      ? "border-red-500 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      : "border-gray-200 bg-white hover:border-red-300 hover:text-red-600 dark:border-gray-700 dark:bg-dark-800 dark:hover:border-red-700 dark:hover:text-red-400"
                  }`}
                  whileTap={{ scale: 0.94 }}
                  animate={
                    activeReactionAnimation === "dislike"
                      ? {
                          scale: [1, 1.14, 1],
                          boxShadow: [
                            "0 0 0 rgba(239,68,68,0)",
                            "0 0 0 10px rgba(239,68,68,0.18)",
                            "0 0 0 rgba(239,68,68,0)",
                          ],
                        }
                      : undefined
                  }
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <ThumbsDown size={16} />
                  <span className="relative inline-flex items-center">
                    Dislike {isReactionLoading ? "..." : dislikes}
                    <AnimatePresence>
                      {activeReactionAnimation === "dislike" && (
                        <motion.span
                          initial={{ opacity: 0, y: 8, scale: 0.8 }}
                          animate={{ opacity: 1, y: -16, scale: 1 }}
                          exit={{ opacity: 0, y: -28, scale: 0.8 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="pointer-events-none absolute -right-4 -top-3 text-xs font-bold text-red-500"
                        >
                          +1
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </motion.button>
              </div>
            </div>
            {reactionError && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400">
                {reactionError}
              </p>
            )}
            <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <form
                onSubmit={handleCommentSubmit}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-dark-800"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Leave a comment
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Share a quick note about the portfolio.
                    </p>
                  </div>
                </div>

                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  rows={3}
                  maxLength={280}
                  placeholder="Write your feedback here..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-dark-900 dark:text-white"
                />

                <div className="mt-3 flex items-center justify-between gap-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {comment.length}/280 characters
                  </p>
                  <button
                    type="submit"
                    disabled={
                      !reactionUserId ||
                      isReactionLoading ||
                      isSubmittingComment ||
                      !comment.trim()
                    }
                    className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmittingComment ? "Posting..." : "Post Comment"}
                  </button>
                </div>

                {commentError && (
                  <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                    {commentError}
                  </p>
                )}
              </form>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-dark-800">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Recent comments
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Latest visitor feedback
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 dark:bg-dark-900 dark:text-gray-300">
                    {comments.length}
                  </span>
                </div>

                <div className="max-h-60 space-y-3 overflow-y-auto pr-1">
                  {isReactionLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={`comment-skeleton-${index}`}
                        className="rounded-xl bg-white px-4 py-3 shadow-sm dark:bg-dark-900"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-dark-700" />
                          <div className="h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-dark-700" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-dark-700" />
                          <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-dark-700" />
                          <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-dark-700" />
                        </div>
                      </div>
                    ))
                  ) : comments.length === 0 ? (
                    <p className="rounded-xl bg-white px-4 py-5 text-sm text-gray-500 dark:bg-dark-900 dark:text-gray-400">
                      No comments yet. Be the first to leave feedback.
                    </p>
                  ) : (
                    comments.slice(0, 5).map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-xl bg-white px-4 py-3 shadow-sm dark:bg-dark-900"
                      >
                        <div className="mb-1 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {entry.userId
                              ? visitorLabelMap[entry.userId]
                              : entry.authorLabel || "Visitor"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatCommentTimestamp(entry.createdAt?.seconds)}
                          </p>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                          {entry.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <AnimatePresence>
        {commentSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.92 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-green-200 bg-white shadow-2xl dark:border-green-900/40 dark:bg-dark-900"
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {[
                  "left-8 top-10",
                  "left-16 top-6",
                  "right-10 top-8",
                  "right-16 top-14",
                  "left-14 bottom-12",
                  "right-14 bottom-10",
                ].map((position, index) => (
                  <motion.span
                    key={position}
                    initial={{ opacity: 0, y: 0, scale: 0.4 }}
                    animate={{
                      opacity: [0, 1, 0],
                      y: [-4, -26 - index * 2, -42 - index * 3],
                      x: [0, index % 2 === 0 ? -10 : 10, index % 2 === 0 ? -18 : 18],
                      scale: [0.4, 1, 0.7],
                      rotate: [0, 18, -18],
                    }}
                    transition={{ duration: 0.8, delay: index * 0.04, ease: "easeOut" }}
                    className={`absolute ${position} h-2.5 w-2.5 rounded-sm ${
                      index % 3 === 0
                        ? "bg-yellow-400"
                        : index % 3 === 1
                          ? "bg-pink-400"
                          : "bg-sky-400"
                    }`}
                  />
                ))}
              </div>
              <div className="px-6 pb-6 pt-7 text-center">
                <motion.div
                  initial={{ scale: 0.7, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 18 }}
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30"
                >
                  <CheckCircle2 size={34} />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Nice!
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {commentSuccess}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
