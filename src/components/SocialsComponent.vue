<script setup lang="ts">
const handleTwitter = () => {
  window.open("https://x.com/HeartsCrushSol", "_blank");
}

const handlePumpFun = () => {
  window.open("https://pump.fun/coin/R5svgiRfuyZvy6gEwp14ezNiuJ6ASTF3eFsdeZCpump", "_blank");
}
</script>

<template>
  <div class="socials-container">
    <div class="social">
      <img class="social--img" src="/assets/images/twitter_2.png" alt="Twitter" @click="handleTwitter">
    </div>
    <div class="social">
      <img class="social--img" src="/assets/images/pill.png" alt="Pump Fun" @click="handlePumpFun">
    </div>
  </div>

</template>

<style scoped>
.socials-container {
  display: flex;
  justify-content: left;
  gap: 20px;
  margin-bottom: 10px;
}
.social {
  transition: border 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  filter: invert(100%);
  background-color: #007e50;
  cursor: pointer;
  border: #007e50 solid 3px;
  border-radius: 50px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.social:hover {
  border-color: black;
  box-shadow: 0px 0px 25px #007e50;
}

.social--img {
  width: 50px;
  height: 50px;
}
</style>