<template>
  <div class="profile_container">
    <div class="card" style="width: 18rem">
      <img
        :src="userProfilePic ? userProfilePic : currentUser.photoURL"
        class="card-img-top"
        alt="..."
      />
      <input
        @change="fileChange"
        type="file"
        v-if="isEdit"
        class="btn btn-sm btn-info"
      />
      <div class="card-body">
        <h5 v-if="!isEdit" class="card-title">{{ currentUser.displayName }}</h5>
        <input
          @change="changeDisplayName"
          v-if="isEdit"
          type="text"
          class="form-control"
          :value="currentUser?.displayName"
        />
        <p class="card-text">
          {{ currentUser.email }}
        </p>

        <button @click="isEdit = !isEdit" class="btn btn-primary btn-sm mx-2">
          {{ isEdit ? "Cancel" : "Edit" }}
        </button>
        <button
          class="btn btn-primary btn-sm mr-2"
          v-if="isEdit"
          @click="saveProfile"
        >
          save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { storage, auth, database } from "../services/firebase/firebase";
export default {
  name: "Profile",
  data() {
    return {
      uploadFile: null,
      isEdit: false,
      userDisplayName: null,
      userProfilePic: null,
      usersListRB_Ref: (uid = "") => database.ref("/usersList/" + uid),
    };
  },
  methods: {
    changeDisplayName(e) {
      this.userDisplayName = e.target.value;
    },
    async fileChange(e) {
      this.uploadFile = e.target.files || e.dataTransfer.files;
    },
    async saveProfile() {
      console.log(this.currentUser);
      this.$store.dispatch("setLoading", {
        isLoading: true,
        message: "Saving Profile",
      });
      if (this.uploadFile || this.userDisplayName) {
        if (this.uploadFile) {
          console.log(this.uploadFile);
          // if user has changed the profile pic
          this.$store.dispatch("setLoading", {
            isLoading: true,
            message: "Uploading Profile Picure..",
          });
          const storageRef = storage
            .ref(`/${auth.currentUser.uid}/` + "DP")
            .child(this.uploadFile[0].name);
          const uploadRef = await storageRef.put(this.uploadFile[0]);
          if (uploadRef.state === "success") {
            this.userProfilePic = await storageRef.getDownloadURL();
          }
        }
        await this.usersListRB_Ref(auth.currentUser.uid).update({
          photoURL: this.userProfilePic,
          displayName: this.userDisplayName
            ? this.userDisplayName
            : this.currentUser.displayName,
        });
        this.$store.dispatch("setLoading", {
          isLoading: true,
          message: "Upading display name..",
        });
        await auth.currentUser.updateProfile({
          photoURL: this.userProfilePic,
          displayName: this.userDisplayName
            ? this.userDisplayName
            : this.currentUser.displayName,
        });
        const payload = {
          displayName: auth.currentUser.displayName || "",
          email: auth.currentUser.email,
          uid: auth.currentUser.uid,
          photoURL: auth.currentUser.photoURL || "",
          online: true,
        };
        this.$store.dispatch("setUser", payload);
        this.isEdit = false;
        this.$store.dispatch("setLoading", {
          isLoading: false,
          message: "",
        });
        this.uploadFile = null;
        this.userDisplayName = null;
      } else {
        this.$store.dispatch("setLoading", {
          isLoading: false,
          message: "",
        });
        alert("please select");
      }
    },
  },
  computed: {
    ...mapGetters(["currentUser"]),
  },
};
</script>

<style scoped>
.profile_container {
  display: flex;
  justify-content: center;
}
</style>
