<script context="module" type="ts">
    declare const io: typeof import("socket.io-client").io;
    declare const google: any;
</script>

<script type="ts">
    import type { Writable } from "svelte/store";
    import { getContext, onMount } from "svelte";
    import type { User, Position, Group } from "../../common/types";
    import { MarkerWithLabel } from "@googlemaps/markerwithlabel";
    import * as api from "../util/api";

    Date.prototype.today = function () {
        return (
            (this.getDate() < 10 ? "0" : "") +
            this.getDate() +
            "/" +
            (this.getMonth() + 1 < 10 ? "0" : "") +
            (this.getMonth() + 1) +
            "/" +
            this.getFullYear()
        );
    };

    Date.prototype.timeNow = function () {
        return (
            (this.getHours() < 10 ? "0" : "") +
            this.getHours() +
            ":" +
            (this.getMinutes() < 10 ? "0" : "") +
            this.getMinutes() +
            ":" +
            (this.getSeconds() < 10 ? "0" : "") +
            this.getSeconds()
        );
    };
    const socket = io();
    const user = getContext<Writable<User>>("user");
    const positions = getContext<Writable<Position[]>>("positions");
    const currentGroup = getContext<Writable<Group>>("group");
    let markers: Array<MarkerWithLabel> = [];
    let actualPosition = $positions.find((e) => e.login == $user.login);
    var map: any;
    var setHome: boolean = false;
    var homePosition: Position;
    var homeMarker: any;
    var rad = function (x: any) {
        return (x * Math.PI) / 180;
    };

    var getDistance = function (p1: any, p2: any) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(p2.lat() - p1.lat());
        var dLong = rad(p2.lng() - p1.lng());
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(p1.lat())) *
                Math.cos(rad(p2.lat())) *
                Math.sin(dLong / 2) *
                Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var distanceInMeters = R * c;
        return distanceInMeters;
    };

    async function initMap() {
        var latLng = new google.maps.LatLng(
            actualPosition?.position.x,
            actualPosition?.position.y
        );

        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 12,
            center: latLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        });
        AddMarkers(map);

        google.maps.event.addListener(map, "click", OnMapClick);

        AddHomeMarker();
    }

    async function AddHomeMarker() {
        homeMarker?.setMap(null);
        if ($currentGroup.home) {
            homeMarker = new MarkerWithLabel({
                position: new google.maps.LatLng(
                    $currentGroup.home.x,
                    $currentGroup.home.y
                ),
                clickable: false,
                draggable: false,
                map: map,
                labelContent: "Dom",
                labelAnchor: new google.maps.Point(-21, 3),
                labelClass: "labels",
                labelStyle: { opacity: 1.0 },
            });
        }
    }

    function OffAllLights() {
        for (const { id } of $currentGroup.lights) {
            api.post("switch-light", {
                id,
                token: $currentGroup.token,
                work: false,
            });
        }
    }

    function IsSomeoneInHome() {
        let minDistance = 100000000;
        if ($currentGroup.home) {
            let home = $currentGroup.home;
            $positions.forEach((position) => {
                let distance = getDistance(
                    new google.maps.LatLng(home.x, home.y),
                    new google.maps.LatLng(
                        position.position.x,
                        position.position.y
                    )
                );
                minDistance = distance < minDistance ? distance : minDistance;
            });
        }
        if (minDistance > 4) {
            OffAllLights();
            InHome = "Nie ma nikogo w domu";
        } else InHome = "";
    }

    function OnMapClick(event: any) {
        if (setHome == true) {
            homeMarker?.setMap(null);
            homePosition = event.latLng;
            homeMarker = new MarkerWithLabel({
                position: homePosition,
                clickable: false,
                draggable: false,
                map: map,
                labelContent: "Dom",
                labelAnchor: new google.maps.Point(-21, 3),
                labelClass: "labels",
                labelStyle: { opacity: 1.0 },
            });
            $currentGroup.home = {
                x: event.latLng.lat(),
                y: event.latLng.lng(),
            };
            socket.emit("setHome", {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
                group: $currentGroup,
            });
            setHome = false;
        }
    }

    function AddMarkers(map: any) {
        for (const marker of markers) {
            marker.setMap(null);
        }
        markers = [];

        $positions.forEach((obj) => {
            markers.push(
                new MarkerWithLabel({
                    position: new google.maps.LatLng(
                        obj.position.x,
                        obj.position.y
                    ),
                    clickable: false,
                    draggable: false,
                    map: map,
                    labelContent: obj.login,
                    labelAnchor: new google.maps.Point(-21, 3),
                    labelClass: "labels",
                    labelStyle: { opacity: 1.0 },
                })
            );
        });
    }
    let InHome = "";

    $: {
        $positions, AddMarkers(map), AddHomeMarker(), IsSomeoneInHome();
    }

    onMount(() => {
        initMap();
        IsSomeoneInHome();
    });
</script>

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
<div id="map" />
<div class="container">
{#each $positions as position}
    <div class="l">
        Użytkownik
        {position.login}
        był w
        {position.street}
        widziany ostatnio
        {new Date(position.time).today()}
        {new Date(position.time).timeNow()}
        <br />
    </div>
{/each}
{InHome}<br>
<button on:click={() => (setHome = true)} class="home">Dom</button>
</div>
<style>
    #map {
        width: 100%;
        height: 400px;
        border: 1px black solid;
    }
    .home {
        background-color: #ff7043;
        border: 1px black solid;
        padding: 5px;
        border-radius: 3px;
        width: 100%;
    }
    .l
    {
        margin: 3px;
        border: 1px solid black;
        padding: 3px;
    }
</style>
