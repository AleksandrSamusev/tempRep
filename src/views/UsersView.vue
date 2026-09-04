<script setup>
import {API_BASE_URL} from '@/config/apiConfig';
import {computed, onMounted, ref} from 'vue';
import userService from "@/service/userService.js";
import brandService from "@/service/brandService.js";
import BaseModal from "@/components/ui/BaseModal.vue";
import AvailabilityForm from "@/components/availability/AvailabilityForm.vue";

const users = ref([]);
const brands = ref([]);

const selectedUser = ref(null);
const selectedDeviceId = ref(null);
const isAddingDevice = ref(false);
const isEditingDevice = ref(false);
const isCreatingUser = ref(false);
const isEditingUser = ref(false);
const isModalOpen = ref(false);


const handleAvailabilityUpdate = async (calendarPayload) => {

  if(!selectedUser.value?.id) return;

  try {
    const response = await userService.updateAvailability(
        selectedUser.value.id,
        calendarPayload
    );
    selectedUser.value.availabilities = response.data;
    isModalOpen.value = false;
  } catch (error) {
    console.error("Failed to commit user availability modifications:", error);
  }
};

const selectedDevice = computed(() => {
  return selectedUser.value?.devices.find(
      device => device.id === selectedDeviceId.value);
});


const types = [
  {value: 'PHONE', label: 'phone'},
  {value: 'LAPTOP', label: 'laptop'},
  {value: 'DESKTOP', label: 'desktop'},
  {value: 'TV', label: 'tv'},
  {value: 'TABLET', label: 'tablet'},
  {value: 'BTKEYBOARD', label: 'bt keyboard'}
]

const newDevice = ref({
  brandId: null,
  model: '',
  os: '',
  osVersion: '',
  type: ''
});

const newUser = ref({
  firstName: "",
  lastName: "",
  email: ""
});

const editableDevice = ref({
  brandId: null,
  model: '',
  os: '',
  osVersion: '',
  type: ''
});

const editableUser = ref({
  firstName: "",
  lastName: "",
  email: ""
});

function handleEditDevice() {
  editableDevice.value = {
    brandId: selectedDevice.value.brandId,
    model: selectedDevice.value.model,
    os: selectedDevice.value.os,
    osVersion: selectedDevice.value.osVersion,
    type: selectedDevice.value.type
  };
  isEditingDevice.value = true;
}

function handleCancelEditingDevice() {
  isEditingDevice.value = false;
}

function handleSelection(user) {
  selectedUser.value = user;
  if (user.devices?.length > 0) {
    selectedDeviceId.value = user.devices[0].id;
  } else {
    selectedDeviceId.value = null;
  }
}

function handleCancelAddingDevice() {
  isAddingDevice.value = false;
  if (selectedUser.value.devices?.length > 0) {
    selectedDeviceId.value = selectedUser.value.devices[0].id;
  } else {
    selectedDeviceId.value = null;
  }
}

onMounted(
    async () => {
      try {
        const response = await userService.getUsers();
        users.value = response.data;
        const brandsResponse = await brandService.getBrands();
        brands.value = brandsResponse.data;
        selectedUser.value = users.value[0];
        selectedDeviceId.value = selectedUser.value.devices[0].id;
        console.log(selectedUser.value)
      } catch (error) {
        console.log(error)
      }
    }
)

function handleAddingDevice() {
  isAddingDevice.value = true;
  selectedDeviceId.value = null;
  console.log(typeof selectedDeviceId.value, selectedDeviceId.value);
}

function handleCreatingUser() {
  isCreatingUser.value = true;
  selectedUser.value = null;
}

async function handleSubmitNewDevice() {
  try {
    console.log(newDevice.value);
    const deviceResponse = await userService.addDevice(selectedUser.value.id, newDevice.value);
    selectedUser.value.devices.push(deviceResponse.data);
    selectedDeviceId.value = deviceResponse.data.id;
    newDevice.value = {
      brandId: null,
      model: '',
      os: '',
      osVersion: '',
      type: ''
    };
    isAddingDevice.value = false;
  } catch (error) {
    console.error(error)
  }
}

async function handleSubmitUpdatedDevice() {
  try {
    const updatedDeviceResponse = await userService.updateDevice(selectedUser.value.id, selectedDevice.value.id, editableDevice.value);
    const updatedDevice = updatedDeviceResponse.data;
    const index = selectedUser.value.devices.findIndex(
        device => device.id === updatedDevice.id
    );
    if (index !== -1) {
      selectedUser.value.devices[index] = updatedDevice;
    }
    selectedDeviceId.value = updatedDevice.id;
    isEditingDevice.value = false;
  } catch (error) {
    console.error(error);
  }
}

async function handleSubmitNewUser() {
  try {
    const newUserResponse = await userService.createUser(newUser.value);
    users.value.push(newUserResponse.data);
    selectedUser.value = newUserResponse.data;
    newUser.value = {
      firstName: "",
      lastName: "",
      email: ""
    };
    isCreatingUser.value = false;
  } catch (error) {
    console.error(error);
  }
}

function handleCancelSubmittingNewUser() {
  isCreatingUser.value = false;
  if (users.value !== null) {
    selectedUser.value = users.value[0];
  } else {
    selectedUser.value = null;
  }
  if (selectedUser?.value.devices?.length > 0) {
    selectedDeviceId.value = selectedUser.value.devices[0].id;
  } else {
    selectedDeviceId.value = null;
  }
  newUser.value = {
    firstName: "",
    lastName: "",
    email: ""
  };
}

function handleCancelEditingUser() {
  isEditingUser.value = false;
  editableUser.value = {
    firstName: "",
    lastName: "",
    email: ""
  };
}

function handleEditingUser() {
  isEditingUser.value = true;
  editableUser.value = {
    firstName: selectedUser.value.firstName,
    lastName: selectedUser.value.lastName,
    email: selectedUser.value.email
  }
}

async function handleSubmitUpdatedUser() {
  try {
    const updatedUserResponse = await userService.updateUser(selectedUser.value.id, editableUser.value);
    const updatedUser = updatedUserResponse.data;
    isEditingUser.value = false;
    const index = users.value.findIndex(
        user => user.id === updatedUser.id
    );
    if (index !== -1) {
      users.value[index] = updatedUser;
    }
    selectedUser.value = updatedUser;
  } catch (error) {
    console.error(error);
  }
}

function getTypeLabel(type) {
  return types.find(t => t.value === type)?.label ?? type;
}
</script>
<template>
  <div class="flex-main-container">
    <div class="left-container">
      <div class="heading-div">
        <h2>Available Users</h2>
        <button v-if="!isCreatingUser" class="btn-save" :disabled="isAddingDevice || isEditingDevice || isEditingUser"
                @click="handleCreatingUser">Add New User
        </button>
        <div class="div-user-cta" v-else-if="isCreatingUser">
          <button class="btn-submit-user" @click="handleSubmitNewUser">Add</button>
          <button class="btn-cancel-submit" @click="handleCancelSubmittingNewUser">Cancel</button>
        </div>
      </div>
      <div class="list-container">
        <ul>
          <li v-for="user in users" :key="user.id" :class="{selected: selectedUser?.id === user.id}">
            <button @click="handleSelection(user)"
                    :disabled="isAddingDevice || isEditingDevice || isCreatingUser || isEditingUser">
              {{ user["firstName"] }} {{ user["lastName"] }}
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div class="right-container">
      <div class="heading-div">
        <h2>User Info</h2>
        <button v-if="!isEditingUser" class="btn-edit-svg"
                :disabled="isAddingDevice || isEditingDevice || isCreatingUser" @click="handleEditingUser">
          <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="9" y="13.4351" width="19" height="4.84634" transform="rotate(-45 9 13.4351)" fill="black"/>
            <path d="M6.80816 19.1919L8.53037 14.3381L11.662 17.4697L6.80816 19.1919Z" fill="black"/>
            <path d="M12.75 3H2V23H22V12.25H24V25H0V1H12.75V3Z" fill="black"/>
          </svg>
        </button>
        <div v-if="isEditingUser" class="div-cta-update-user">
          <button class="btn-submit-user" @click="handleSubmitUpdatedUser">Update</button>
          <button class="btn-cancel-submit" @click="handleCancelEditingUser">Cancel</button>
        </div>
      </div>
      <div class="right-side-wrapper">
        <div class="right-top-content">
          <div class="logo-div">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="60" fill="#C7C7C7"/>
              <circle cx="60" cy="51" r="18" fill="#949494"/>
              <path
                  d="M60 75C79.33 75 95 87.7599 95 103.5C95 105.467 94.7549 107.387 94.2891 109.241C84.5697 116.022 72.7497 120 60 120C47.25 120 35.4295 116.022 25.71 109.241C25.2442 107.387 25 105.467 25 103.5C25 87.7599 40.67 75 60 75Z"
                  fill="#949494"/>
            </svg>
          </div>
          <div class="labels-div">
            <div class="flex-row">
              <div class="label-wrapper">
                <span>First Name:</span>
              </div>
              <p v-if="selectedUser && !isCreatingUser && !isEditingUser">{{ selectedUser["firstName"] }}</p>
              <input class="input-user" v-if="isCreatingUser" v-model="newUser.firstName" type="text">
              <input class="input-user" v-if="isEditingUser" v-model="editableUser.firstName" type="text">
            </div>
            <div class="flex-row">
              <div class="label-wrapper">
                <span>Last Name:</span>
              </div>
              <p v-if="selectedUser && !isCreatingUser && !isEditingUser">{{ selectedUser["lastName"] }}</p>
              <input class="input-user" v-if="isCreatingUser" v-model="newUser.lastName" type="text">
              <input class="input-user" v-if="isEditingUser" v-model="editableUser.lastName" type="text">
            </div>
            <div class="flex-row">
              <div class="label-wrapper">
                <span>Email:</span>
              </div>
              <p v-if="selectedUser && !isCreatingUser && !isEditingUser">{{ selectedUser["email"] }}</p>
              <input class="input-user" v-if="isCreatingUser" v-model="newUser.email" type="text">
              <input class="input-user" v-if="isEditingUser" v-model="editableUser.email" type="text">
            </div>
            <div class="flex-row">
              <div class="label-wrapper">
                <span>Devices:</span>
              </div>
              <select v-if="selectedUser" name="devices" id="devices" v-model="selectedDeviceId"
                      :disabled="isAddingDevice || isEditingDevice || isEditingUser">
                <option v-for="device in selectedUser['devices']" :key="device['id']" :value="device['id']">
                  {{ device.model }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="bottom-right-wrapper">
          <div class="heading-div">
            <h2>Device Info</h2>
          </div>
          <div class="right-top-content">
            <div class="logo-div">
              <img v-if="selectedDevice" :src="`${API_BASE_URL}${selectedDevice['brandLogo']}`" alt="">
              <svg class="svg-brand-placeholder" v-else width="140" height="140" viewBox="0 0 140 140" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <circle cx="70" cy="70" r="70" fill="#C7C7C7"/>
                <path
                    d="M17.152 74V65.408H20.26C21.052 65.408 21.684 65.618 22.156 66.038C22.632 66.458 22.87 66.986 22.87 67.622C22.87 68.102 22.75 68.5 22.51 68.816C22.27 69.132 21.956 69.36 21.568 69.5V69.542C22.06 69.658 22.46 69.9 22.768 70.268C23.076 70.632 23.23 71.072 23.23 71.588C23.23 72.284 22.984 72.86 22.492 73.316C22.004 73.772 21.352 74 20.536 74H17.152ZM18.316 72.938H20.512C20.952 72.938 21.32 72.808 21.616 72.548C21.916 72.288 22.066 71.95 22.066 71.534C22.066 71.126 21.914 70.784 21.61 70.508C21.31 70.228 20.918 70.088 20.434 70.088H17.932V69.062H20.248C20.684 69.062 21.04 68.942 21.316 68.702C21.592 68.462 21.73 68.142 21.73 67.742C21.73 67.338 21.59 67.024 21.31 66.8C21.03 66.576 20.678 66.464 20.254 66.464H18.316V72.938ZM24.7696 74V67.682H25.8436V68.78L25.7116 68.66H25.8796C26.0076 68.32 26.2376 68.038 26.5696 67.814C26.9016 67.59 27.2616 67.478 27.6496 67.478C27.7696 67.478 27.8976 67.49 28.0336 67.514C28.1696 67.534 28.3536 67.592 28.5856 67.688L28.4056 68.774C28.1776 68.686 28.0036 68.63 27.8836 68.606C27.7636 68.582 27.6576 68.57 27.5656 68.57C27.1016 68.57 26.7096 68.75 26.3896 69.11C26.0696 69.466 25.9096 69.952 25.9096 70.568V74H24.7696ZM31.3771 74.198C30.6931 74.198 30.1291 74.006 29.6851 73.622C29.2451 73.234 29.0251 72.706 29.0251 72.038C29.0251 71.374 29.2671 70.848 29.7511 70.46C30.2351 70.072 30.8611 69.878 31.6291 69.878C32.0091 69.878 32.3591 69.922 32.6791 70.01C33.0031 70.094 33.2811 70.208 33.5131 70.352V69.938C33.5131 69.47 33.3571 69.112 33.0451 68.864C32.7331 68.612 32.3331 68.486 31.8451 68.486C31.4891 68.486 31.1711 68.55 30.8911 68.678C30.6111 68.802 30.3191 69.006 30.0151 69.29L29.3011 68.588C29.7211 68.184 30.1251 67.898 30.5131 67.73C30.9011 67.562 31.3691 67.478 31.9171 67.478C32.7251 67.478 33.3791 67.696 33.8791 68.132C34.3791 68.568 34.6291 69.17 34.6291 69.938V74H33.5431V72.716L33.8011 73.136H33.5071C33.3231 73.428 33.0451 73.678 32.6731 73.886C32.3011 74.094 31.8691 74.198 31.3771 74.198ZM31.5931 73.25C32.1211 73.25 32.5751 73.062 32.9551 72.686C33.3351 72.306 33.5251 71.86 33.5251 71.348V71.312C33.3211 71.136 33.0671 71 32.7631 70.904C32.4631 70.804 32.1531 70.754 31.8331 70.754C31.3211 70.754 30.9191 70.864 30.6271 71.084C30.3351 71.304 30.1891 71.616 30.1891 72.02C30.1891 72.396 30.3151 72.696 30.5671 72.92C30.8191 73.14 31.1611 73.25 31.5931 73.25ZM36.3946 74V67.682H37.4866V68.786L37.3246 68.576H37.5226C37.7186 68.26 38.0086 68 38.3926 67.796C38.7766 67.588 39.2046 67.484 39.6766 67.484C40.4246 67.484 41.0006 67.688 41.4046 68.096C41.8086 68.5 42.0106 69.062 42.0106 69.782V74H40.8646V70.016C40.8646 69.52 40.7446 69.14 40.5046 68.876C40.2646 68.612 39.8806 68.48 39.3526 68.48C38.8326 68.48 38.3986 68.656 38.0506 69.008C37.7066 69.36 37.5346 69.8 37.5346 70.328V74H36.3946ZM46.4414 74.198C45.5734 74.198 44.8434 73.888 44.2514 73.268C43.6634 72.648 43.3694 71.842 43.3694 70.85C43.3694 69.834 43.6574 69.02 44.2334 68.408C44.8134 67.796 45.5234 67.49 46.3634 67.49C46.8794 67.49 47.3334 67.606 47.7254 67.838C48.1214 68.066 48.4134 68.342 48.6014 68.666H48.6434V65.21H49.7834V74H48.6794V72.86L48.8594 73.1H48.6434C48.4234 73.416 48.1234 73.678 47.7434 73.886C47.3674 74.094 46.9334 74.198 46.4414 74.198ZM46.6154 73.226C47.2114 73.226 47.7054 73.012 48.0974 72.584C48.4934 72.156 48.6914 71.582 48.6914 70.862C48.6914 70.142 48.4874 69.564 48.0794 69.128C47.6754 68.692 47.1874 68.474 46.6154 68.474C46.0154 68.474 45.5174 68.692 45.1214 69.128C44.7254 69.564 44.5274 70.138 44.5274 70.85C44.5274 71.562 44.7234 72.136 45.1154 72.572C45.5074 73.008 46.0074 73.226 46.6154 73.226ZM54.6758 76.622V67.682H55.7798V69.008L55.5398 68.708H55.8158C56.0318 68.34 56.3378 68.044 56.7338 67.82C57.1298 67.596 57.5738 67.484 58.0658 67.484C58.9378 67.484 59.6598 67.792 60.2318 68.408C60.8038 69.02 61.0898 69.832 61.0898 70.844C61.0898 71.856 60.7918 72.668 60.1958 73.28C59.6038 73.892 58.9018 74.198 58.0898 74.198C57.5578 74.198 57.0958 74.09 56.7038 73.874C56.3158 73.658 56.0318 73.386 55.8518 73.058H55.8158V76.622H54.6758ZM57.8558 73.22C58.4718 73.22 58.9698 72.998 59.3498 72.554C59.7338 72.11 59.9258 71.534 59.9258 70.826C59.9258 70.11 59.7258 69.538 59.3258 69.11C58.9298 68.678 58.4398 68.462 57.8558 68.462C57.2598 68.462 56.7618 68.686 56.3618 69.134C55.9658 69.582 55.7678 70.15 55.7678 70.838C55.7678 71.542 55.9578 72.116 56.3378 72.56C56.7218 73 57.2278 73.22 57.8558 73.22ZM62.5157 74V65.21H63.6557V74H62.5157ZM67.4122 74.198C66.7282 74.198 66.1642 74.006 65.7202 73.622C65.2802 73.234 65.0602 72.706 65.0602 72.038C65.0602 71.374 65.3022 70.848 65.7862 70.46C66.2702 70.072 66.8962 69.878 67.6642 69.878C68.0442 69.878 68.3942 69.922 68.7142 70.01C69.0382 70.094 69.3162 70.208 69.5482 70.352V69.938C69.5482 69.47 69.3922 69.112 69.0802 68.864C68.7682 68.612 68.3682 68.486 67.8802 68.486C67.5242 68.486 67.2062 68.55 66.9262 68.678C66.6462 68.802 66.3542 69.006 66.0502 69.29L65.3362 68.588C65.7562 68.184 66.1602 67.898 66.5482 67.73C66.9362 67.562 67.4042 67.478 67.9522 67.478C68.7602 67.478 69.4142 67.696 69.9142 68.132C70.4142 68.568 70.6642 69.17 70.6642 69.938V74H69.5782V72.716L69.8362 73.136H69.5422C69.3582 73.428 69.0802 73.678 68.7082 73.886C68.3362 74.094 67.9042 74.198 67.4122 74.198ZM67.6282 73.25C68.1562 73.25 68.6102 73.062 68.9902 72.686C69.3702 72.306 69.5602 71.86 69.5602 71.348V71.312C69.3562 71.136 69.1022 71 68.7982 70.904C68.4982 70.804 68.1882 70.754 67.8682 70.754C67.3562 70.754 66.9542 70.864 66.6622 71.084C66.3702 71.304 66.2242 71.616 66.2242 72.02C66.2242 72.396 66.3502 72.696 66.6022 72.92C66.8542 73.14 67.1962 73.25 67.6282 73.25ZM75.2977 74.204C74.3177 74.204 73.5257 73.884 72.9217 73.244C72.3217 72.604 72.0217 71.798 72.0217 70.826C72.0217 69.862 72.3217 69.064 72.9217 68.432C73.5217 67.796 74.3177 67.478 75.3097 67.478C75.8457 67.478 76.3197 67.582 76.7317 67.79C77.1437 67.994 77.5137 68.314 77.8417 68.75L77.0257 69.41C76.7937 69.094 76.5397 68.866 76.2637 68.726C75.9877 68.586 75.6597 68.516 75.2797 68.516C74.6837 68.516 74.1837 68.728 73.7797 69.152C73.3797 69.576 73.1797 70.134 73.1797 70.826C73.1797 71.514 73.3817 72.076 73.7857 72.512C74.1897 72.948 74.6877 73.166 75.2797 73.166C75.6757 73.166 76.0237 73.088 76.3237 72.932C76.6237 72.772 76.8877 72.526 77.1157 72.194L77.9737 72.812C77.6417 73.292 77.2557 73.644 76.8157 73.868C76.3797 74.092 75.8737 74.204 75.2977 74.204ZM82.0472 74.198C81.0832 74.198 80.2992 73.888 79.6952 73.268C79.0952 72.644 78.7952 71.836 78.7952 70.844C78.7952 69.896 79.0872 69.1 79.6712 68.456C80.2552 67.808 81.0272 67.484 81.9872 67.484C82.8992 67.484 83.6292 67.772 84.1772 68.348C84.7252 68.924 84.9992 69.668 84.9992 70.58C84.9992 70.66 84.9972 70.742 84.9932 70.826C84.9892 70.91 84.9792 71.012 84.9632 71.132H79.4492V70.232H83.8592V70.226C83.8272 69.742 83.6492 69.332 83.3252 68.996C83.0052 68.656 82.5592 68.486 81.9872 68.486C81.3912 68.486 80.9012 68.696 80.5172 69.116C80.1372 69.536 79.9472 70.11 79.9472 70.838C79.9472 71.594 80.1492 72.174 80.5532 72.578C80.9612 72.982 81.4792 73.184 82.1072 73.184C82.4992 73.184 82.8472 73.108 83.1512 72.956C83.4552 72.8 83.7472 72.546 84.0272 72.194L84.8372 72.764C84.5372 73.248 84.1552 73.608 83.6912 73.844C83.2312 74.08 82.6832 74.198 82.0472 74.198ZM86.4571 74V65.21H87.5971V68.552H87.6331C87.8251 68.248 88.1031 67.994 88.4671 67.79C88.8351 67.586 89.2671 67.484 89.7631 67.484C90.5071 67.484 91.0771 67.688 91.4731 68.096C91.8731 68.5 92.0731 69.062 92.0731 69.782V74H90.9271V70.016C90.9271 69.496 90.7991 69.11 90.5431 68.858C90.2911 68.602 89.9211 68.474 89.4331 68.474C88.9011 68.474 88.4611 68.658 88.1131 69.026C87.7691 69.394 87.5971 69.828 87.5971 70.328V74H86.4571ZM96.7799 74.198C95.7879 74.198 94.9819 73.88 94.3619 73.244C93.7419 72.608 93.4319 71.808 93.4319 70.844C93.4319 69.868 93.7459 69.064 94.3739 68.432C95.0019 67.796 95.8039 67.478 96.7799 67.478C97.7519 67.478 98.5519 67.8 99.1799 68.444C99.8119 69.088 100.128 69.888 100.128 70.844C100.128 71.796 99.8179 72.594 99.1979 73.238C98.5779 73.878 97.7719 74.198 96.7799 74.198ZM96.7799 73.166C97.4079 73.166 97.9279 72.952 98.3399 72.524C98.7559 72.092 98.9639 71.532 98.9639 70.844C98.9639 70.16 98.7559 69.602 98.3399 69.17C97.9279 68.734 97.4079 68.516 96.7799 68.516C96.1439 68.516 95.6199 68.732 95.2079 69.164C94.7959 69.592 94.5899 70.152 94.5899 70.844C94.5899 71.536 94.7959 72.096 95.2079 72.524C95.6199 72.952 96.1439 73.166 96.7799 73.166ZM101.551 74V65.21H102.691V74H101.551ZM107.191 74.198C106.323 74.198 105.593 73.888 105.001 73.268C104.413 72.648 104.119 71.842 104.119 70.85C104.119 69.834 104.407 69.02 104.983 68.408C105.563 67.796 106.273 67.49 107.113 67.49C107.629 67.49 108.083 67.606 108.475 67.838C108.871 68.066 109.163 68.342 109.351 68.666H109.393V65.21H110.533V74H109.429V72.86L109.609 73.1H109.393C109.173 73.416 108.873 73.678 108.493 73.886C108.117 74.094 107.683 74.198 107.191 74.198ZM107.365 73.226C107.961 73.226 108.455 73.012 108.847 72.584C109.243 72.156 109.441 71.582 109.441 70.862C109.441 70.142 109.237 69.564 108.829 69.128C108.425 68.692 107.937 68.474 107.365 68.474C106.765 68.474 106.267 68.692 105.871 69.128C105.475 69.564 105.277 70.138 105.277 70.85C105.277 71.562 105.473 72.136 105.865 72.572C106.257 73.008 106.757 73.226 107.365 73.226ZM115.211 74.198C114.247 74.198 113.463 73.888 112.859 73.268C112.259 72.644 111.959 71.836 111.959 70.844C111.959 69.896 112.251 69.1 112.835 68.456C113.419 67.808 114.191 67.484 115.151 67.484C116.063 67.484 116.793 67.772 117.341 68.348C117.889 68.924 118.163 69.668 118.163 70.58C118.163 70.66 118.161 70.742 118.157 70.826C118.153 70.91 118.143 71.012 118.127 71.132H112.613V70.232H117.023V70.226C116.991 69.742 116.813 69.332 116.489 68.996C116.169 68.656 115.723 68.486 115.151 68.486C114.555 68.486 114.065 68.696 113.681 69.116C113.301 69.536 113.111 70.11 113.111 70.838C113.111 71.594 113.313 72.174 113.717 72.578C114.125 72.982 114.643 73.184 115.271 73.184C115.663 73.184 116.011 73.108 116.315 72.956C116.619 72.8 116.911 72.546 117.191 72.194L118.001 72.764C117.701 73.248 117.319 73.608 116.855 73.844C116.395 74.08 115.847 74.198 115.211 74.198ZM119.621 74V67.682H120.695V68.78L120.563 68.66H120.731C120.859 68.32 121.089 68.038 121.421 67.814C121.753 67.59 122.113 67.478 122.501 67.478C122.621 67.478 122.749 67.49 122.885 67.514C123.021 67.534 123.205 67.592 123.437 67.688L123.257 68.774C123.029 68.686 122.855 68.63 122.735 68.606C122.615 68.582 122.509 68.57 122.417 68.57C121.953 68.57 121.561 68.75 121.241 69.11C120.921 69.466 120.761 69.952 120.761 70.568V74H119.621Z"
                    fill="black"/>
              </svg>
            </div>
            <div class="labels-div">
              <div class="flex-row">
                <div class="label-wrapper"><span>Brand:</span></div>
                <p v-if="selectedDevice && !isEditingDevice && !isAddingDevice">{{ selectedDevice["brandName"] }}</p>
                <select v-else-if="isAddingDevice" v-model="newDevice.brandId">
                  <option :value="brand.id" v-for="brand in brands" :key="brand.id">{{ brand["name"] }}</option>
                </select>
                <select v-else-if="isEditingDevice" v-model="editableDevice.brandId">
                  <option :value="brand.id" v-for="brand in brands" :key="brand.id">{{ brand["name"] }}</option>
                </select>
              </div>
              <div class="flex-row">
                <div class="label-wrapper"><span>Model:</span></div>
                <p v-if="selectedDevice && !isEditingDevice && !isAddingDevice">{{ selectedDevice["model"] }}</p>
                <input v-else-if="isAddingDevice" v-model="newDevice.model" type="text">
                <input v-else-if="isEditingDevice" v-model="editableDevice.model" type="text">
              </div>
              <template v-if="selectedDevice && !isEditingDevice && !isAddingDevice">
                <div class="flex-row">
                  <div class="label-wrapper">
                    <span>OS:</span>
                  </div>
                  <p>{{ selectedDevice["os"] }} {{ selectedDevice["osVersion"] }}</p></div>
              </template>
              <template v-else-if="isAddingDevice">
                <div class="flex-row">
                  <div class="label-wrapper"><span>OS:</span></div>
                  <input v-model="newDevice.os" type="text">
                  <div class="version-label-wrapper"><span>Ver:</span></div>
                  <input class="input-version" v-model="newDevice.osVersion" type="text"></div>
              </template>
              <template v-else-if="isEditingDevice">
                <div class="flex-row">
                  <div class="label-wrapper"><span>OS:</span></div>
                  <input v-model="editableDevice.os" type="text">
                  <div class="version-label-wrapper"><span>Ver:</span></div>
                  <input class="input-version" v-model="editableDevice.osVersion" type="text"></div>
              </template>
              <div class="flex-row">
                <div class="label-wrapper">
                  <span>Type:</span>
                </div>
                <p v-if="selectedDevice && !isEditingDevice && !isAddingDevice">{{
                    getTypeLabel(selectedDevice.type)
                  }}</p>
                <select v-else-if="isAddingDevice" v-model="newDevice.type">
                  <option :value="type.value" v-for="type in types" :key="type.value">{{ type.label }}</option>
                </select>
                <select v-else-if="isEditingDevice" v-model="editableDevice.type">
                  <option :value="type.value" v-for="type in types" :key="type.value">{{ type.label }}</option>
                </select>
              </div>
            </div>
          </div>
          <br>
          <div class="flex-row">
            <button v-if="!isAddingDevice && !isEditingDevice" :disabled="isCreatingUser || isEditingUser"
                    class="btn-save"
                    @click="handleAddingDevice">Add New Device
            </button>
            <button v-if="selectedDevice && !isEditingDevice" class="btn-edit" @click="handleEditDevice"
                    :disabled="isEditingUser">Edit
            </button>
            <template v-if="isAddingDevice">
              <button class="btn-save" @click="handleSubmitNewDevice">Add</button>
              <button class="btn-edit" @click="handleCancelAddingDevice">Cancel</button>
            </template>
            <template v-else-if="isEditingDevice">
              <button class="btn-save" @click="handleSubmitUpdatedDevice">Update</button>
              <button class="btn-edit" @click="handleCancelEditingDevice">Cancel</button>
            </template>
          </div>
        </div>
        <div class="bottom-right-wrapper">
          <div class="heading-div"
               style="margin: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <h2>Availability</h2>
            <button v-if="!isEditingUser" class="manage-availability-btn"
                    :disabled="isAddingDevice || isEditingDevice || isCreatingUser" @click="isModalOpen = true">
              Manage Availability
            </button>
          </div>
          <BaseModal v-if="isModalOpen" @close="isModalOpen = false">
            <AvailabilityForm
                :initial-availabilities="selectedUser?.availabilities"
                @cancel="isModalOpen = false"
                @submit="handleAvailabilityUpdate"/>
          </BaseModal>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.manage-availability-btn {
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #000000;
  padding: 8px 16px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.manage-availability-btn:hover:not(:disabled) {
  background-color: #f4f4f5;
  border-color: #27272a;
}

.manage-availability-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  border-color: #e4e4e7;
}

.flex-main-container {
  margin-top: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 550px;
  gap: 3rem;
}

.left-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  width: 40%;
}

.right-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  width: 50%;
}


.right-top-content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 2rem;
  width: 100%;
}

.label-wrapper {
  width: 100px;
}

.labels-div {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: flex-start;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  line-height: 2rem;
}

.buttons-flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  line-height: 2rem;
  gap: 1rem;
}

.list-container {
  flex: 1;
  width: 100%;
  border: 1px solid #D7D7D7;
  border-radius: 10px;
  overflow-y: auto;
}

.logo-div {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;
  min-height: 140px;
  background: none;
  border: 1px solid #D7D7D7;
  border-radius: 10px;
  overflow: hidden;
}

.right-side-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: space-between;
}

.bottom-right-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  margin-top: 1.5rem;
}

ul {
  padding: 30px 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.5rem;
  list-style: none;
}

li {
  width: 100%;
}

li button {
  font-size: 1rem;
  font-weight: normal;
  width: 100%;
  text-align: left;
  padding: 0 10px;
  border-radius: 0;
}

button {
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 5px;
}

.labels-div button {
  border: none;
  cursor: pointer;
  width: 120px;
  height: 40px;
  background-color: #B4EDD9;
  font-weight: bold;
  font-size: 1rem;
}

.labels-div span {
  font-size: 1rem;
  font-weight: 400;
}

.labels-div p {
  font-size: 1.1rem;
  font-weight: 500;
}

.flex-row .btn-save, .heading-div .btn-save {
  background: none;
  border: 1px solid gray;
  font-weight: bold;
  font-size: 1rem;
  width: 140px;
  height: 40px;
  margin-right: 2rem;
}

h2 {
  margin-top: 1rem;
  font-size: 2rem;
}

img {
  width: 120px;
  height: 120px;
}

span {
  font-size: 1.3rem;
  font-weight: bold;
}

.device-image {
  width: 140px;
  height: 140px;
}

select {
  font-family: Abel, sans-serif;
  font-size: 0.85rem;
  height: 1.75rem;
  width: 180px;
  padding-left: 0.25rem;
}

.btn-edit {
  border: none;
  cursor: pointer;
  width: 100px;
  height: 40px;
  background-color: #B4EDD9;
  font-weight: bold;
  font-size: 1rem;
}

.selected {
  background-color: #B4EDD9;
}

.logo-div img {
  width: 120px;
  height: 120px;
}

.heading-div {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.5rem;
}

.heading-div .btn-save {
  margin: 0;
}

.right-container .heading-div {
  justify-content: flex-start;
  align-items: center;
}

.btn-edit-svg {
  margin-left: 2rem;
}

.svg-brand-placeholder {
  width: 120px;
  height: 120px;
}

input {
  font-size: 1.1rem;
  border: none;
  border-bottom: 1px solid gray;
  padding-left: 0.5rem;
  outline: none;
  font-weight: 500;
  width: 120px;
}

input::placeholder {
  font-size: 14px;
}

.version-label-wrapper {
  width: auto;
}

.btn-edit-svg:disabled {
  opacity: 0.4;
}

.heading-div .btn-submit-user, .heading-div .btn-cancel-submit {
  width: 80px;
  height: 30px;
  border: 1px solid black;
  font-weight: bold;
}

.div-user-cta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}

.input-user {
  width: 200px;
}

.div-cta-update-user {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 1rem;
  gap: 1rem;
}
</style>