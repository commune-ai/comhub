import { useState } from 'react';
import Modal from 'react-modal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string, type: 'sr25519' | 'ecdsa') => void;
}

export const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keyType, setKeyType] = useState<'sr25519' | 'ecdsa'>('sr25519');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password, keyType);
    setUsername('');
    setPassword('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select
          value={keyType}
          onChange={(e) => setKeyType(e.target.value as 'sr25519' | 'ecdsa')}
          className="w-full p-2 border rounded"
        >
          <option value="sr25519">Polkadot (SR25519)</option>
          <option value="ecdsa">Ethereum (ECDSA)</option>
        </select>
        <button 
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Login
        </button>
      </form>
    </Modal>
  );
};
