import { ViroScene, Viro360Image } from "@reactvision/react-viro";

const VRPhotoScene = ({
    handleLoadStart,
    handleLoadEnd,
    handleError,
    tourUrl,
}: {
    handleLoadStart: () => void;
    handleLoadEnd: (event: any) => void;
    handleError: (event: any) => void;
    tourUrl: string;
}) => {
    // Don't render Viro360Image if no valid tourUrl
    if (!tourUrl) {
        return <ViroScene />;
    }

    return (
        <ViroScene>
            <Viro360Image
                source={{ uri: tourUrl }}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                onError={handleError}
            />
        </ViroScene>
    );
};

export default VRPhotoScene;
