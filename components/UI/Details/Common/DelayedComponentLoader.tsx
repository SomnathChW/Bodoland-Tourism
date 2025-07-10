/**
 * DelayedComponentLoader Component
 * Author: SomnathChW
 * Created: 2025-04-14 08:24:23 UTC
 *
 * This component provides a mechanism to delay rendering of child components
 * to improve perceived performance and prioritize critical UI elements.
 *
 * Usage:
 * <DelayedComponentLoader shouldRender={true} delay={300}>
 *   <YourComponent />
 * </DelayedComponentLoader>
 */

import React, { useEffect, useState } from "react";

interface DelayedComponentLoaderProps {
    /**
     * Whether to start rendering the component or not
     */
    shouldRender?: boolean;

    /**
     * Delay in milliseconds before showing the component after shouldRender becomes true
     */
    delay?: number;

    /**
     * Children to render after delay
     */
    children: React.ReactNode;

    /**
     * Optional callback when component becomes visible
     */
    onShow?: () => void;
}

/**
 * A utility component that defers rendering of its children until after
 * a specified delay. This helps optimize UI performance by prioritizing
 * critical elements and progressively loading less important ones.
 */
export const DelayedComponentLoader: React.FC<DelayedComponentLoaderProps> = ({
    shouldRender = false,
    delay = 0,
    children,
    onShow,
}) => {
    // State to track if the component should be visible
    const [isVisible, setIsVisible] = useState(false);

    // Set up the delay timer when shouldRender changes
    useEffect(() => {
        if (shouldRender) {
            // Only set up timer if we're not already visible
            if (!isVisible) {
                const timer = setTimeout(() => {
                    setIsVisible(true);
                    // Call onShow callback if provided
                    onShow?.();
                }, delay);

                // Clean up the timer on unmount or when shouldRender changes
                return () => clearTimeout(timer);
            }
        } else {
            // If shouldRender becomes false, hide the component
            setIsVisible(false);
        }

        return () => {}; // Empty cleanup when no timer was created
    }, [shouldRender, delay, onShow, isVisible]);

    // Don't render anything until visible
    if (!isVisible) return null;

    // Once visible, render the children
    return <>{children}</>;
};

// Export memoized component to prevent unnecessary re-renders
export default React.memo(DelayedComponentLoader);
