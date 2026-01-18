import {router} from 'expo-router';

export type MenuItemConfig = {
    key: string;
    label: string;
    onPress: () => void;
};

export function getProductMenuItems(): MenuItemConfig[]{
    return [
        {
            key: "Home", 
            label: "Home",
            onPress: ()=>{
                router.replace({pathname:"/", params: {page: "Overview"}});
            },
        },
        {
            key: "Products",
            label: "Products",
            onPress: ()=>{
                router.replace({pathname:"/", params: {page: "Products"}});
            },
        },
        {
            key: "Orders", 
            label: "Orders",
            onPress: () => {
                router.replace({pathname:"/", params: {page: "Orders"}});
            },
        },
             {
            key: "Prediction Logic", 
            label: "Prediction Logic", 
            onPress: () => {
                router.push("/Predictions");
            },
        },
        {
            key:"Settings", 
            label:"Settings",
            onPress: () => {
                router.push("/Settings");
            },
        },
    ];
}