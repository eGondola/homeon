<svelte:head>
    <style>
         .labels {
        color: #ffffff;
        font-family: Roboto, Arial, sans-serif;
        font-size: 10px;
        font-weight: bold;
        text-align: center;
        width: 40px;
        padding: 2px;
        border: 1px solid #999;
        box-sizing: border-box;
        white-space: nowrap;
        margin: 1vmin;
        border-radius: 10vmin;
        background-color: #ff7043;
      }
    </style>
</svelte:head>
<script context="module" type="ts">
    declare const io: typeof import("socket.io-client").io;
</script>
<script type="ts">
    import type { Writable } from "svelte/store";
    import { getContext, onMount } from "svelte";
    import type { User, position } from "../../common/types";
    import { MarkerWithLabel } from '@googlemaps/markerwithlabel';

    Date.prototype.today = function() { 
        return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
    }

    Date.prototype.timeNow = function() {
        return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
    }
    const socket = io();
    const user = getContext<Writable<User>>("user");
    const positions = getContext<Writable<position[]>>("positions");
    const currentGroup = getContext<Writable<any>>("group");
    let markers: Array<MarkerWithLabel> = [];
    let actualPosition = $positions.find(e => e.login == $user.login);
    var map:any;
    var setHome:boolean = false;
    var homePosition:position;
    var homeMarker:any;
    async function initMap() {
        var latLng = new google.maps.LatLng(actualPosition?.position.x, actualPosition?.position.y);
        //var homeLatLng = new google.maps.LatLng(49.47805, -123.84716);

        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 12,
            center: latLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        });
        AddMarkers(map);
        
        google.maps.event.addListener(map, 'click', OnMapClick);

        AddHomeMarker()
    }

    async function AddHomeMarker()
    {
        homeMarker?.setMap(null);
        if($currentGroup.home)
        {
            homeMarker = new MarkerWithLabel({
                position: new google.maps.LatLng($currentGroup.home.x, $currentGroup.home.y),
                clickable: false,
                draggable: false,
                map: map,
                labelContent: "Dom",
                labelAnchor: new google.maps.Point(-21, 3),
                labelClass: "labels", // the CSS class for the label
                labelStyle: { opacity: 1.0 },
            });
        }
    }

    function OnMapClick(event:any){
            if(setHome == true)
            {
                console.log(event.latLng.lat(), event.latLng.lng())
                homeMarker?.setMap(null);
                homePosition = event.latLng;
                homeMarker = new MarkerWithLabel({
                    position: homePosition,
                    clickable: false,
                    draggable: false,
                    map: map,
                    labelContent: "Dom",
                    labelAnchor: new google.maps.Point(-21, 3),
                    labelClass: "labels", // the CSS class for the label
                    labelStyle: { opacity: 1.0 },
                });
                $currentGroup.home = {x: event.latLng.lat(), y: event.latLng.lng()}
                //fetch("/setHome", {method: "POST", body: JSON.stringify({lat: event.latLng.lat(), lng: event.latLng.lng()})})
                socket.emit("setHome", {lat: event.latLng.lat(), lng: event.latLng.lng(), group: $currentGroup})
                setHome = false;
            }
        }

    function AddMarkers(map:any)
    {
        for(const marker of markers)
        {
            marker.setMap(null);
        }
        markers = [];

        $positions.forEach(obj => {
            markers.push(new MarkerWithLabel({
                position: new google.maps.LatLng(obj.position.x, obj.position.y),
                clickable: false,
                draggable: false,
                map: map,
                labelContent: obj.login,
                labelAnchor: new google.maps.Point(-21, 3),
                labelClass: "labels", // the CSS class for the label
                labelStyle: { opacity: 1.0 },
            }))
        })
    }

    $: { $positions, AddMarkers(map), AddHomeMarker() }

    onMount(() => {
        initMap();
    });
</script>
<div id="map"></div>
{#each $positions as position}
    <div>
        Użytkownik 
        {position.login}
        był w 
        {position.street} 
        widziany ostatnio 
        {new Date(position.time).today()} {new Date(position.time).timeNow()}
        <br>
    </div>
{/each}
<button on:click={() => setHome = true}>Dom</button>
<style>
    #map {
        width: 100%;
        height: 400px;
    }
</style>
