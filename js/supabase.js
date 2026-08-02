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

async function requireLogin() {
    const user = await getCurrentUser();

    if (!user) {
        window.location.href = "login.html";
        return null;
    }

    return user;
}

async function logout() {

    await supabaseClient.auth.signOut();

    window.location.href = "login.html";

}

checkLogin();