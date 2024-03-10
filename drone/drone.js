// Context: https://www.reddit.com/r/meirl/comments/1bb3o92/comment/ku7glpq/?utm_source=share&utm_medium=web2x&context=3
let me_drone_coordinates = [400, 200];
let other_drone_coordinates = {"drone-1": [500, 900], "done-2": [395, 200]};

const axis_buffer = 10; // In units, how far we want our drone to stay away from other drones.

function am_i_in_violation(new_x, new_y) {
    let in_violation = false;
    other_drone_coordinates.forEach((data) => {
        if (in_violation == true) {
            return; // Already found a violation, any future calculations are null.
        }

        if (data[0] == new_x) {
            // This drone is on the same X-axis as me.
        }
        if (data[1] == new_y) {
            // This drone is on the same Y-axis as me.
        }
    
        let in_violation = false;
        // A drone is within the 10 unit X/Y-Axis buffer, we might collide, move!
        if (Math.abs(data[0]-new_x) < 10 || Math.abs(data[1]) == new_y) {
            in_violation = true;
        }
    });

    return in_violation;
}

function need_to_move(current_x, current_y, their_x, their_y) {
    let new_x = null;
    // Another drone is violating the 10 unit X-Axis buffer.
    if (Math.abs(their_x-current_x) < axis_buffer) { // Difference is less than buffer, this violating it.
        if (current_x < their_x) { // Other drone coordinate is less than ours, if we were to add to the X-axis, we'd collide. We need to minus.
            new_x = Math.abs(their_x-current_x)-1;
        }
        if (current_x > their_x) { // Other drone coordinate is more than ours, if we were to subtract the X-axis, we'd collide. We need to add.
            new_x = Math.abs(their_x-current_x)+1;
        }
    } else {
        new_x = me_drone_coordinates[0]; // Keep current X-axis, buffer not in violation, no need to change.
    }

    let new_y = null;
    // Another drone is violating the 10 unit Y-Axis buffer.
    if (Math.abs(their_y-current_y) < axis_buffer) { // Difference is less than buffer, this violating it.
        if (current_y < their_y) { // Other drone coordinate is less than ours, if we were to add to the X-axis, we'd collide. We need to minus.
            new_y = Math.abs(their_y-current_y)-1;
        }
        if (current_y > their_y) { // Other drone coordinate is more than ours, if we were to subtract the X-axis, we'd collide. We need to add.
            new_y = Math.abs(their_y-current_y)+1;
        }
    } else {
        new_y = current_y; // Keep current Y-axis, buffer not in violation, no need to change.
    }

    return { x: new_x, y: new_y };
}

function drone_handling(data) {
    if (data[0] == me_drone_coordinates[0]) {
        // This drone is on the same X-axis as me.
    }
    if (data[1] == me_drone_coordinates[1]) {
        // This drone is on the same Y-axis as me.
    }

    let need_to_move = false;
    // A drone is within the 10 unit X/Y-Axis buffer, we might collide, move!
    if (Math.abs(data[0]-me_drone_coordinates[0]) < 10 || Math.abs(data[1]) == me_drone_coordinates[1]) {
        need_to_move = true;
    }

    if (need_to_move == true) {
        let need_to_move_output = need_to_move(me_drone_coordinates[0], me_drone_coordinates[1], data[0], data[1]);

        // Let's make sure these new coordinates aren't another violation, where we collide with another drone.
        if (am_i_in_violation(need_to_move_output.x, need_to_move_output.y) == true) {
            // lmao now you're in violation, run it up again bucko.
            drone_handling(data);
        } else {
            // Found new coordinates, move before we're hit!
            me_drone_coordinates = [need_to_move_output.x, need_to_move_output.y];
        }
    }
}

other_drone_coordinates.forEach((data) => {
    drone_handling(data); // Here we pass it off to a function so that "drone_handling" can be repeated when am_i_in_violation returns true.
});
