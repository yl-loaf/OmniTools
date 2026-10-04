import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Users, UserPlus, UserCheck, ShieldCheck, Trophy, Sparkles, Search } from 'lucide-react';

interface FriendsHubProps {
  currentUser: UserProfile | null;
  users: UserProfile[];
  onUpdateFriends: (newFriendIds: string[]) => void;
  onOpenAuth: () => void;
}

export const FriendsHub: React.FC<FriendsHubProps> = ({
  currentUser,
  users,
  onUpdateFriends,
  onOpenAuth,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-blue-950 border border-blue-800 mx-auto flex items-center justify-center">
          <Users className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white">Friends & Social Hub</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Sign in to add friends, connect with community members, and see each other's names across contributions.
          </p>
        </div>
        <button
          onClick={onOpenAuth}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-500/20"
        >
          Sign In to Access Friends
        </button>
      </div>
    );
  }

  const myFriendIds = currentUser.friendIds || [];

  const handleToggleFriend = (targetUid: string) => {
    if (targetUid === currentUser.uid) return;
    const isFriend = myFriendIds.includes(targetUid);
    const updated = isFriend
      ? myFriendIds.filter((id) => id !== targetUid)
      : [...myFriendIds, targetUid];
    onUpdateFriends(updated);
  };

  const filteredUsers = users.filter((u) => {
    if (u.uid === currentUser.uid) return false;
    return u.displayName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const friendsList = users.filter((u) => myFriendIds.includes(u.uid));

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">Friends & Social Network</h2>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                {friendsList.length} Friends
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Add friends to see each other's actual display names across community contributions and leaderboards.
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search community members..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-hidden focus:border-blue-500"
          />
        </div>
      </div>

      {/* Friends Grid */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Your Friends ({friendsList.length})</h3>
        {friendsList.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-500 text-xs">
            You haven't added any friends yet. Search community members below to add friends!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {friendsList.map((friend) => (
              <div key={friend.uid} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md">
                    {friend.displayName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{friend.displayName}</h4>
                    <div className="text-[11px] font-mono text-emerald-400">{friend.contributionPoints} CP • Level {Math.floor(friend.contributionPoints / 10) + 1}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleFriend(friend.uid)}
                  className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/60 rounded-xl text-xs font-bold transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Community Members List */}
      <div className="space-y-6 pt-4 border-t border-slate-800">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Discover Community Members</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => {
            const isFriend = myFriendIds.includes(user.uid);

            return (
              <div key={user.uid} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md">
                    {user.displayName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{user.displayName}</h4>
                    <div className="text-[11px] font-mono text-slate-400">{user.contributionPoints} CP</div>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleFriend(user.uid)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    isFriend
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                      : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/25'
                  }`}
                >
                  {isFriend ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Friends</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5 text-white" />
                      <span>Add Friend</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
