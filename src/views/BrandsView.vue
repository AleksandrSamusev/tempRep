<script setup>
import brandService from "@/service/brandService.js";
import {onMounted, ref} from 'vue';
import {API_BASE_URL} from '@/config/apiConfig';

const brands = ref([]);
const isEditing = ref(false);
const selectedBrand = ref({
  "id": "",
  "name": "",
  "website": "",
  "logoUrl": "",
  "countryCode": ""
});

let newBrand = ref({
  "name": "",
  "website": "",
  "countryCode": ""
});

const editableBrand = ref({
  "name": "",
  "website": "",
  "countryCode": ""
});

onMounted(async () => {
  try {
    const response = await brandService.getBrands();
    brands.value = response.data;
    selectedBrand.value = brands.value[0];
    console.log(response.data)
  } catch (error) {
    console.error(error);
  }
});

function handleSelection(brand) {
  selectedBrand.value = brand;
  console.log(brand.logoUrl)
}

async function handleSave() {
  try {
    const response = await brandService.createBrand(newBrand.value);
    const createdBrand = response.data;
    brands.value.push(createdBrand);
    selectedBrand.value = createdBrand;
    brands.value.sort((a, b) =>
        a.name.localeCompare(b.name)
    );
    newBrand = ref({
      "name": "",
      "website": "",
      "countryCode": ""
    });
  } catch (error) {
    console.log(error)
  }
}

function handleEdit() {
  editableBrand.value = {
    name: selectedBrand.value.name,
    website: selectedBrand.value.website,
    countryCode: selectedBrand.value.countryCode
  }
  isEditing.value = true;
}

function handleCancel() {
  isEditing.value = false;
}

async function handleUpdate() {
  try {
    const response = await brandService.updateBrand(selectedBrand.value.id, editableBrand.value);
    const updatedBrand = response.data;
    const index = brands.value.findIndex(
        brand => brand.id === updatedBrand.id
    );
    if(index !== -1) {
      brands.value[index] = updatedBrand;
    }
    selectedBrand.value = updatedBrand;
    isEditing.value = false;
  } catch (error) {
    console.error(error)
  }
}

</script>
<template>
  <div class="flex-main-container">
    <div class="left-container">
      <h2>Available Brands</h2>
      <div class="list-container">
        <ul>
          <li v-for="brand in brands" :key="brand.id" :class="{selected: selectedBrand.id === brand.id}">
            <button @click="handleSelection(brand)">{{ brand.name }}</button>
          </li>
        </ul>
      </div>
    </div>
    <div class="right-container">
      <h2>Brand Info</h2>
      <div class="right-side-wrapper">
        <div class="right-top-content" v-if="selectedBrand">
          <div class="logo-div">
            <img :src="`${API_BASE_URL}${selectedBrand.logoUrl}`" alt="">
          </div>
          <div class="labels-div">
            <div class="flex-row">
              <div class="label-wrapper">
                <span>Name:</span>
              </div>
              <p v-if="!isEditing">{{ selectedBrand.name }}</p>
              <input v-else v-model="editableBrand.name" type="text">
            </div>
            <div class="flex-row">
              <div class="label-wrapper">
                <span>Country:</span>
              </div>
              <p v-if="!isEditing">{{ selectedBrand.countryCode }}</p>
              <input v-else v-model="editableBrand.countryCode" type="text">
            </div>
            <div class="flex-row">
              <div class="label-wrapper">
                <span>Website:</span>
              </div>
              <p v-if="!isEditing">{{ selectedBrand.website }}</p>
              <input v-else v-model="editableBrand.website" type="text">
            </div>
            <button v-if="!isEditing" @click="handleEdit" class="btn-edit">Edit</button>
            <div v-else class="flex-row">
              <div class="label-wrapper">
                <button @click="handleUpdate" class="btn-edit">Update</button>
              </div>
              <button @click="handleCancel" class="btn-edit">Cancel</button>
            </div>
          </div>
        </div>
        <div class="bottom-right-wrapper">
          <h2>Add New Brand</h2>
          <div class="right-top-content">
            <div class="logo-div">
              <span class="placeholder-span">Click to select image</span>
            </div>
            <div class="labels-div">
              <div class="flex-row">
                <div class="label-wrapper">
                  <span>Name:</span>
                </div>
                <input v-model="newBrand.name" type="text" placeholder="add name">
              </div>
              <div class="flex-row">
                <div class="label-wrapper">
                  <span>Country:</span>
                </div>
                <input v-model="newBrand.countryCode" type="text" placeholder="add country">
              </div>
              <div class="flex-row">
                <div class="label-wrapper">
                  <span>Website:</span>
                </div>
                <input v-model="newBrand.website" type="text" placeholder="add website">
              </div>
              <button @click="handleSave" class="btn-save">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
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
}

.logo-div img {
  width: 120px;
  height: 120px;
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
  width: 80px;
  height: 30px;
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


.labels-div .btn-save {
  background: none;
  border: 1px solid gray;
}

h2 {
  margin-bottom: 1rem;
  font-size: 2rem;
}

img {
  width: 140px;
  height: 140px;
}

span {
  font-size: 1.3rem;
  font-weight: bold;
}

.placeholder-span {
  font-size: 0.75rem;
  color: #A2A2A2;
  font-weight: normal;
}

.placeholder-text {
  font-size: 0.85rem;
  color: #A2A2A2;
  font-weight: normal;
}

.selected {
  background-color: #B4EDD9;
}

input {
  font-size: 1.1rem;
  border: none;
  border-bottom: 1px solid gray;
  padding-left: 0.5rem;
  outline: none;
  font-weight: 500;
}

input::placeholder {
  font-size: 14px;
}
</style>