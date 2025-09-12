import { ViroScene, Viro360Image } from "@reactvision/react-viro";

const VRPhotoScene = ({
    handleLoadStart,
    handleLoadEnd,
    handleError,
    tour_resource: tour_resource,
}: {
    handleLoadStart: () => void;
    handleLoadEnd: (event: any) => void;
    handleError: (event: any) => void;
    tour_resource: string;
}) => {
    // Don't render Viro360Image if no valid tour_resource
    if (!tour_resource) {
        return <ViroScene />;
    }

    return (
        <ViroScene>
            <Viro360Image
                source={{ uri: tour_resource }}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                onError={handleError}
            />
        </ViroScene>
    );
};

export default VRPhotoScene;
