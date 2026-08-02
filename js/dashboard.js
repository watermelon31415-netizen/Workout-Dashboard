let currentUser = null;

async function loadDashboard() {

    // 登录检查
    currentUser = await requireLogin();

    if (!currentUser) return;

    // 显示当前用户邮箱
    const emailElement = document.getElementById("userEmail");

    if (emailElement) {
        emailElement.innerText = currentUser.email;
    }

    // 今天星期几
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long"
    });

    // 今日计划
    const { data: todayPlans, error: todayError } = await supabaseClient
        .from("workout_plans")
        .select(`
            *,
            workouts(*)
        `)
        .eq("user_id", currentUser.id)
        .eq("day", today);

    if (todayError) {
        console.log(todayError);
        return;
    }

    const container = document.getElementById("todayWorkout");

    if (!todayPlans || todayPlans.length === 0) {

        container.innerHTML = `
            <p>No workout planned today 🎉</p>
        `;

    } else {

        container.innerHTML = "";

        todayPlans.forEach(plan => {

            container.innerHTML += `
                <div class="today-item">

                    <h3>${plan.time_slot}</h3>

                    <p>${plan.workouts.title}</p>

                    <p>⏱ ${plan.workouts.duration} min</p>

                    <button onclick="completeWorkout(${plan.workouts.id})">
                        ✅ Complete
                    </button>

                </div>
            `;

        });

    }

    // 全部计划
    const { data: allPlans, error: planError } = await supabaseClient
        .from("workout_plans")
        .select(`
            *,
            workouts(*)
        `)
        .eq("user_id", currentUser.id);

    if (planError) {
        console.log(planError);
        return;
    }

    // 完成记录
    const { data: history, error: historyError } = await supabaseClient
        .from("workout_history")
        .select("*")
        .eq("user_id", currentUser.id);

    if (historyError) {
        console.log(historyError);
        return;
    }

    document.getElementById("completedWorkouts").innerText =
        history.length;

    document.getElementById("totalWorkouts").innerText =
        allPlans.length;

    let totalMinutes = 0;

    allPlans.forEach(plan => {

        if (plan.workouts) {
            totalMinutes += plan.workouts.duration || 0;
        }

    });

    document.getElementById("totalMinutes").innerText =
        totalMinutes;

}


// 完成运动
async function completeWorkout(workoutId) {

    currentUser = await requireLogin();

    if (!currentUser) return;

    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabaseClient
        .from("workout_history")
        .insert([
            {
                workout_id: workoutId,
                completed_date: today,
                user_id: currentUser.id
            }
        ]);

    if (error) {

        console.log(error);

        alert(error.message);

        return;

    }

    alert("Workout completed 🎉");

    loadDashboard();

}

loadDashboard();
