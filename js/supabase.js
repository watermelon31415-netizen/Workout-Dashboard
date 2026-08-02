const SUPABASE_URL = "https://ocqurgwxtqhmvavmbrky.supabase.co";
const SUPABASE_KEY = "sb_publishable_euhGO6kO7Q7cciA3G_hiqg_xZ1xnoHy";


const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// 获取当前登录用户
async function getCurrentUser(){

    const { data, error } =
    await supabaseClient.auth.getUser();


    if(error){

        console.log("No user logged in");

        return null;

    }


    return data.user;

}