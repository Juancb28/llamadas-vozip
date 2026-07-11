import { useSearchParams, useNavigate } from 'react-router-dom';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';

function CallPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const room = searchParams.get('room');
    const token = searchParams.get('token');
    const livekitUrl = searchParams.get('livekitUrl');
    const sessionId = searchParams.get('sessionId');

    if (!token || !livekitUrl) {
        return <p>Enlace inválido o incompleto. Verifica el enlace que recibiste.</p>;
    }

    const handleDisconnect = () => {
        navigate(`/rating?sessionId=${sessionId}`);
    };

    return (
        <div style={{ height: '100vh' }}>
            <LiveKitRoom
                token={token}
                serverUrl={livekitUrl}
                connect={true}
                video={true}
                audio={true}
                onDisconnected={handleDisconnect}
                onError={(error) => {
                    console.error('Error de LiveKit:', error);
                }}
                data-lk-theme="default"
                style={{ height: '100%' }}
            >
                <VideoConference />
            </LiveKitRoom>
        </div>
    );
}

export default CallPage;