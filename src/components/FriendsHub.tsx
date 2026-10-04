import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Users, UserPlus, UserCheck, ShieldCheck, Trophy, Sparkles, Search, Hash } from 'lucide-react';

interface FriendsHubProps {
  currentUser: UserProfile | null;
  users: UserProfile[];
  onUpdateFriends: (newFriendIds: string[]) => void;
  onOpenAuth: () => void;
}

export function getUserHexCode(uid: string): string {
  let hash = 0;
  for (let i = 0; i < uid.length; i++) {
    hash = uid.charCodeAt(i) + ((hash << 5) - hash);
  }
  let hex = (hash & 0x00ffffff).toString(16).toUpperCase();
  while (hex.length < 6) {
    hex = '0' + hex;
  }
  return '#' + hex;
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
            Sign in to add friends, connect using unique hexadecimal codes, and collaborate across community contributions.
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
    const hexCode = getUserHexCode(u.uid);
    const query = searchQuery.toLowerCase();
    // Search by hexadecimal code or partial hex
    return (
      hexCode.toLowerCase().includes(query) ||
      u.uid.toLowerCase().includes(query)
    );
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
              Your Unique Hex Code: <strong className="text-cyan-400 font-mono">{getUserHexCode(currentUser.uid)}</strong>. Share this code with friends so they can discover and add you securely!
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <Hash className="w-4 h-4 absolute left-3 top-3 text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by friend's hex code (e.g. #A489F2)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono focus:outline-hidden focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Friends Grid */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Your Friends ({friendsList.length})</h3>
        {friendsList.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-500 text-xs">
            You haven't added any friends yet. Enter your friend's special hexadecimal code in the search bar above to discover and connect!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {friendsList.map((friend) => {
              const hexCode = getUserHexCode(friend.uid);
              return (
                <div key={friend.uid} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-mono font-bold text-white text-xs shadow-md">
                      {hexCode.slice(1, 4)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{friend.displayName}</h4>
                      <div className="text-[11px] font-mono text-cyan-400">{hexCode} • {friend.contributionPoints} CP</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleFriend(friend.uid)}
                    className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/60 rounded-xl text-xs font-bold transition"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Discover Community Members List (Hidden Real Names, Searchable via Hex Code) */}
      <div className="space-y-6 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Discover Community Members by Hex Code</h3>
            <p className="text-xs text-slate-400 mt-0.5">Real names are hidden until added as a friend. Search by user hex code.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => {
            const isFriend = myFriendIds.includes(user.uid);
            const hexCode = getUserHexCode(user.uid);

            return (
              <div key={user.uid} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-mono font-bold text-white text-xs shadow-md">
                    {hexCode.slice(1, 4)}
                  </div>
                  <div>
                    <h4 className="text-sm font-mono font-bold text-cyan-300">{hexCode}</h4>
                    <div className="text-[11px] text-slate-400 font-mono">Anonymous Contributor • {user.contributionPoints} CP</div>
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
