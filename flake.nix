{
  description = "Javascript implementation of the Bitcoin protocol for any Bitcoin based coins";

  # Nixpkgs / NixOS version to use.
  inputs.nixpkgs.url = "nixpkgs/nixos-unstable"; # needed for nodePackage.terser

  outputs = { self, nixpkgs }:

    let
      # Project doesnt define versions so defaulting to last commit date
      version = "05-09-2020";

      # Any system that can run a browser.
      supportedSystems = [
        "x86_64-linux"
        "i686-linux"
        "x86_64-darwin"
        "aarch64-linux"
        "armv6l-linux"
        "armv7l-linux"
        "aarch64-darwin"
      ];

      # Helper function to generate an attrset '{ x86_64-linux = f "x86_64-linux"; ... }'.
      forAllSystems = f:
        nixpkgs.lib.genAttrs supportedSystems (system: f system);

      # Nixpkgs instantiated for supported system types.
      nixpkgsFor = forAllSystems (system:
        import nixpkgs {
          inherit system;
          overlays = [ self.overlay ];
        });

    in {

      overlay = final: prev: {
        bitcoin-transactions =
          let inherit (final) stdenv nodejs lib nodePackages;
          in stdenv.mkDerivation {
            name = "bitcoin-transactions-${version}";

            src = self;

            buildInputs = [ nodejs ];

            dontBuild = true;

            installPhase = ''
              mkdir -p $out/
              cp -r ./* $out/
            '';

            meta = {
              homepage = "https://peersm.com/wallet";
              description =
                "Javascript implementation of the Bitcoin protocol for any Bitcoin based coins";
              license = lib.licenses.mit;
            };
          };
      };

      # Provide some binary packages for selected system types.
      packages = forAllSystems
        (system: { inherit (nixpkgsFor.${system}) bitcoin-transactions; });

      # These apps load the package as a standalone offline webapp
      # For these to work the XDG browser variable needs to be set to something that exists
      # To test run `xdg-settings get default-web-browser` if this fails
      # prepend the nix run command with your installed browser with
      # BROWSER=<installed browser> nix run ...
      defaultApp = forAllSystems (system:
        let pkgs = nixpkgsFor.${system};
        in {
          type = "app";
          program = "${pkgs.writeShellScript "bitcoin-transactions" ''
            # Clear shows the Javascript unminified and readable
            if [ "$1" == "clear" ] || [ "$1" == "c" ]; then
              PAGE=html/walletclear.html
            else
              PAGE=html/wallet.html
            fi
            ${pkgs.xdg-utils}/bin/xdg-open ${pkgs.bitcoin-transactions}/$PAGE
          ''}";
        });

      defaultPackage =
        forAllSystems (system: self.packages.${system}.bitcoin-transactions);

      nixosModules.bitcoin-transactions = { pkgs, lib, ... }:
        let
          inherit (lib) toUpper substring stringAsChars;
          systemApp = self.defaultApp.${pkgs.system}.program;
          defaultPackage = self.defaultPackage.${pkgs.system};
          capitalize = str: toUpper (substring 0 1 str) + substring 1 (-1) str;
          sanitize = str: stringAsChars (x: if x == "-" then " " else x) str;
        in {
          environment.systemPackages = [
            (pkgs.makeDesktopItem {
              name = defaultPackage.name;
              exec = systemApp;
              desktopName = capitalize (sanitize defaultPackage.name);
              comment = defaultPackage.meta.description;
              icon = "${defaultPackage.src}/desktopIcon.png";
            })
          ];
        };

      devShell = forAllSystems (system:
        let inherit (nixpkgsFor.${system}) mkShell nodePackages;
        in mkShell {
          buildInputs = [ nodePackages.browserify nodePackages.terser ];
          inputsFrom = builtins.attrValues self.packages.${system};
        });

      # Tests run by 'nix flake check' and by Hydra.
      checks = forAllSystems (system: {
        inherit (self.packages.${system}) bitcoin-transactions;

        # Additional tests, if applicable.
        test = with nixpkgsFor.${system};
          stdenv.mkDerivation {
            name = "bitcoin-transactions-test-${version}";

            buildInputs = [ nodejs bitcoin-transactions ];

            unpackPhase = "true";

            buildPhase = ''
              echo 'running some integration tests'
              ln -s ${bitcoin-transactions}/* .

              cp tests/general.js integration-tests.js

              # Run all tests apart from the one that checks the network connection
              sed -i '
                  /^\(node\)/!d
                  /suprnova/d' integration-tests.js

              bash integration-tests.js
            '';

            installPhase = "mkdir -p $out";
          };
      });
    };
}
