'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setUid('');
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(
        auth, email.trim(), pw
      );

      const user = result.user;
      setUid(user.uid);

      const owner = await getDoc(doc(db, 'owners', user.uid));

      if (!owner.exists()) {
        setError('DOKUMEN OWNER TIDAK DITEMUKAN. Periksa Document ID Firestore.');
        return;
      }

      router.replace('/admin');
    } catch (e: any) {
      setError(
        'KODE: ' + (e.code || 'unknown') +
        ' | PESAN: ' + (e.message || 'Login gagal')
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="wrap center">
      <form className="panel login" onSubmit={submit}>
        <h1>Login Owner</h1>
        <label>
          <span>Email</span>
          <input type="email" value={email}
            onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>
          <span>Password</span>
          <input type="password" value={pw}
            onChange={e => setPw(e.target.value)} required />
        </label>
        {error && <p className="err">{error}</p>}
        {uid && <p>UID akun: {uid}</p>}
        <button className="btn" disabled={loading}>
          {loading ? 'Memeriksa...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}
