/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function ($) {

    "use strict";


})(jQuery);

function deleteStaff(staffId) {
    if (confirm("Are you sure to delete?") == true) {
        fetch(`/WeddingMWeb/api/staffs/${staffId}`, {
            method: "delete",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function(res) {
            if (res.status == 200) {
                let d = document.getElementById(`staff${staffId}`);
                d.style.display = "none";
            } else {
                alert("Something wrong!!!");
            }
        })
    }
}