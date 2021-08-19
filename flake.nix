{
  description =
    "Javascript implementation of the Bitcoin protocol for any Bitcoin based coins";

  # Nixpkgs / NixOS version to use.
  inputs.nixpkgs.url = "nixpkgs/nixos-unstable"; # needed for nodePackage.terser

  # Upstream source tree(s).
  inputs.bitcoin-transactions-src = {
    url = "path:./.";
    flake = false;
  };

  outputs = { self, nixpkgs, bitcoin-transactions-src }:

    let
      # System types to support.
      supportedSystems = [ "x86_64-linux" ];

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
            name = "bitcoin-transactions";

            src = bitcoin-transactions-src;

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
      apps = forAllSystems (system: {
        wallet = let pkgs = nixpkgsFor.${system};
        in {
          type = "app";
          program = "${
              pkgs.writeShellScriptBin "bitcoin-transactions" ''
                ${pkgs.xdg-utils}/bin/xdg-open ${pkgs.bitcoin-transactions}/html/wallet.html
              ''
            }/bin/bitcoin-transactions";
        };
        # This shows the Javascript unminified and readable
        wallet-clear = let pkgs = nixpkgsFor.${system};
        in {
          type = "app";
          program = "${
              pkgs.writeShellScriptBin "bitcoin-transactions" ''
                ${pkgs.xdg-utils}/bin/xdg-open ${pkgs.bitcoin-transactions}/html/walletclear.html
              ''
            }/bin/bitcoin-transactions";
        };
      });

      defaultPackage =
        forAllSystems (system: self.packages.${system}.bitcoin-transactions);

      devShell = forAllSystems (system:
        let
          pkgs = nixpkgsFor.${system};
          inherit (pkgs) mkShell nodePackages;
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

              # Run all general tests apart from the one that checks the network connection
              while read line; do
                if [[ $line == node* ]] && [[ $line != *suprnova* ]]; then
                  $line
                fi
              done < tests/general.js
            '';

            installPhase = "mkdir -p $out";
          };
      });
    };
}
