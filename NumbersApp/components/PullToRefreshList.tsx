import { useCallback, useState } from "react";
import { FlatList, FlatListProps } from "react-native";

type Props<T> = Omit<FlatListProps<T>, "refreshing" | "onRefresh"> & {
    onRefreshAsync: () => Promise<void>;
};

export default function PullToRefreshList<T>({
    onRefreshAsync,
    ...props
}: Props<T>){
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        if(refreshing) return;
        setRefreshing(true);
        try{
            await onRefreshAsync();
        } finally{
            setRefreshing(false);
        }
    }, [onRefreshAsync, refreshing]);

    return <FlatList {...props} refreshing={refreshing} onRefresh={onRefresh}/>;
}