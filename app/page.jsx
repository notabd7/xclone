'use client'
import { useEffect, useState } from "react";

export default function Home() {
  const [tweets, setTweets] = useState([])
  const [tweetText, setTweetText] = useState('')
  const [users, setUsers] = useState([])
  const [currentUserIndex, setCurrentUserIndex] = useState(0)
  const [userVocabulary, setUserVocabulary] = useState({})

  useEffect(() => {
    InitializeUsers();
  }, []);

//making an array of hardcoded users that get iterated over for each tweetW
const InitializeUsers = () => {
  // Array of hardcoded users
  const hardcodedUsers = [
    {
      name: 'User1',
      id: '123'
    },
    {
      name: 'User2',
      id: '456'
    },
    {
      name: 'User3',
      id: '789'
    }
  ]
  setUsers(hardcodedUsers)
  
  // Initialize vocabulary map for each user
  const initialVocab = {}
  hardcodedUsers.forEach(user => {
    initialVocab[user.id] = new Set()
  })
  setUserVocabulary(initialVocab)
}

  const getUser = (userId) => {
    // find uder by its id and return the user name
    const user = users.find(user => user.id === userId)
    return user ? user.name : '';
  }

  const getMostFrequentPoster = () => {
    // store tweet counts
    const tweetCounts = {};
    
    // Count tweets for each user
    tweets.forEach(tweet => {
      if (tweetCounts[tweet.userId]) {
        tweetCounts[tweet.userId]++;
      } else {
        tweetCounts[tweet.userId] = 1;
      }
    });

    // Find user with most tweets
    let maxTweets = 0;
    let mostFrequentPosterId = null;
  
    //iterate over tweet counts to check which user has the most tweets
    Object.entries(tweetCounts).forEach(([userId, count]) => {
      if (count > maxTweets) {
        maxTweets = count;
        mostFrequentPosterId = userId;
      }
    });

    // Get user name from ID
    return mostFrequentPosterId ? getUser(mostFrequentPosterId) : '';
  }

//update the vicab mao with every post
const updateUserVocabulary = (userId, text) => {
  // Split text into words and clean them (lowercase, remove punctuation)
  const words = text.toLowerCase()
                   .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
                   .split(/\s+/)
  
  setUserVocabulary(prevVocab => {
    const updatedVocab = { ...prevVocab }
    // Add each word to user's Set of unique words
    words.forEach(word => {
      updatedVocab[userId].add(word)
    })
    return updatedVocab
  })
}

const getVocabularyLeader = () => {
  let maxWords = 0
  let leaderUserId = null

  Object.entries(userVocabulary).forEach(([userId, wordSet]) => {
    if (wordSet.size > maxWords) {
      maxWords = wordSet.size
      leaderUserId = userId
    }
  })

  const leader = users.find(user => user.id === leaderUserId)
  return leader ? `${leader.name} (${maxWords} unique words)` : ''
}

const handleTweet = () => {
  if (!tweetText.trim()) return;
  
  // Generate random index for user selection
  const randomUserIndex = Math.floor(Math.random() * users.length);

  // Update vocabulary for the posting user
  updateUserVocabulary(users[randomUserIndex].id, tweetText)

  const newTweet = {
    id: Date.now(),
    content: tweetText,
    timestamp: new Date().toISOString(),
    userId: users[randomUserIndex].id
  };
  
  setTweets([newTweet, ...tweets])
  setTweetText('');
  //iterating over to the next user
  //update post display
  setCurrentUserIndex(randomUserIndex)
}

  return (
    <div className="max-w-xl mx-auto p-4">
      {/* Tweet Input Section */}
      <div className="mb-6">
        <textarea
          value={tweetText}
          onChange={(e) => setTweetText(e.target.value)}
          placeholder="x.com, the everything app"
          className="w-full p-4 border"
        />
        <div className="flex justify-between items-center">
          {/* //show current tweets on the timeline */}
          <span>{tweets.length} tweets</span>

          {/* show number of tweets made by a user */}
          <span>{getMostFrequentPoster()} is the most frequent poster    </span>
          {/* largest vocab user */}
          <span>Largest vocabulary: {getVocabularyLeader()}</span>
          <button
            onClick={handleTweet}
            disabled={!tweetText.trim()}
          >
            Post
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {tweets.map((tweet) => (
          <div
            key={tweet.id}
            className="p-4 border"
          >
            <p>{tweet.content}</p>
            <p>
              {getUser(tweet.userId)} • {new Date(tweet.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}