
<!-- Component to display a loading screen or custom text with a rotating loading svg -->
<script>
  //Text to be displayed on LoadingDisplay, defaults to "Loading..."
  export let text = "Loading...";
</script>

<div class="loading-container">
  <div class="content-container">
    <p>{text}</p>
    <div class="svg-loader">
      <svg class="svg-container" height="100" width="100" viewBox="0 0 100 100">
        <circle class="loader-svg bg" cx="50" cy="50" r="45"></circle>
        <circle class="loader-svg animate" cx="50" cy="50" r="45"></circle>
      </svg>
    </div>
  </div>
</div>

<style>
  p {
    text-align: center;
    margin: 10px 0;
    color: white;
  }

  /* Main loading container */
  .loading-container {
    width: 100%;
    height: 100%;
    background: gray;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .svg-loader{
    display:flex;
    position: relative;
    align-content: space-around;
    justify-content: center;
  }

  .loader-svg{
    position: absolute;
    left: 0; right: 0; top: 0; bottom: 0;
    fill: none;
    stroke-width: 5px;
    stroke-linecap: round;
    stroke: rgb(216, 2, 2);
  }

  .loader-svg.bg{
    stroke-width: 8px;
    stroke: rgb(161, 155, 155);
  }

  /* Animation & Keyframes */

  .animate{
    stroke-dasharray: 242.6;
    animation: fill-animation 1s cubic-bezier(1,1,1,1) 0s infinite;
  }

  @keyframes fill-animation{
    0%{
      stroke-dasharray: 40 242.6;
      stroke-dashoffset: 0;
    }
    50%{
      stroke-dasharray: 141.3;
      stroke-dashoffset: 141.3;
    }
    100%{
      stroke-dasharray: 40 242.6;
      stroke-dashoffset: 282.6;
    }
  }
</style>